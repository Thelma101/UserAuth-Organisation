// src/middleware/validation.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();
const secret = 'your_jwt_secret';
const saltRounds = 10;

// Validation middlewares
const validateUserFields = (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    const errors = [];

    if (!firstName) {
        errors.push({ field: 'firstName', message: 'First name is required' });
    }
    if (!lastName) {
        errors.push({ field: 'lastName', message: 'Last name is required' });
    }
    if (!email) {
        errors.push({ field: 'email', message: 'Email is required' });
    }
    if (!password) {
        errors.push({ field: 'password', message: 'Password is required' });
    }

    if (errors.length > 0) {
        return res.status(422).json({ errors });
    }

    next();
};

const validateLoginFields = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({
            errors: [
                { field: !email ? 'email' : 'password', message: 'Email and password are required' }
            ]
        });
    }
    next();
};

router.post('/register', validateUserFields, async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phone
            }
        });

        const defaultOrgName = `${firstName}'s Organisation`;
        const organisation = await prisma.organisation.create({
            data: {
                name: defaultOrgName,
                users: { connect: { userId: user.userId } }
            }
        });

        const accessToken = jwt.sign({ userId: user.userId }, secret);
        res.status(201).json({
            status: 'success',
            message: 'Registration successful',
            data: {
                accessToken,
                user
            }
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(400).json({
            status: 'Bad request',
            message: 'Registration unsuccessful',
            statusCode: 400
        });
    }
});

router.post('/login', validateLoginFields, async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password',
                statusCode: 401
            });
        }

        const accessToken = jwt.sign({ userId: user.userId }, secret);
        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                accessToken,
                user
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({
            status: 'Internal server error',
            message: 'Login failed',
            statusCode: 500
        });
    }
});

router.get('/users/:id', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { userId: req.params.id }
        });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
                statusCode: 404
            });
        }

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            status: 'Internal server error',
            message: 'Failed to fetch user',
            statusCode: 500
        });
    }
});

router.get('/organisations', async (req, res) => {
    try {
        const userId = req.user.userId; // Assuming req.user is set after token validation
        const organisations = await prisma.organisation.findMany({
            where: { users: { some: { userId } } }
        });

        res.status(200).json({
            status: 'success',
            message: 'Organisations fetched successfully',
            data: { organisations }
        });
    } catch (error) {
        console.error('Error fetching organisations:', error);
        res.status(500).json({
            status: 'Internal server error',
            message: 'Failed to fetch organisations',
            statusCode: 500
        });
    }
});

router.get('/organisations/:orgId', async (req, res) => {
    try {
        const organisation = await prisma.organisation.findUnique({
            where: { orgId: req.params.orgId }
        });

        if (!organisation) {
            return res.status(404).json({
                status: 'error',
                message: 'Organisation not found',
                statusCode: 404
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Organisation fetched successfully',
            data: { organisation }
        });
    } catch (error) {
        console.error('Error fetching organisation:', error);
        res.status(500).json({
            status: 'Internal server error',
            message: 'Failed to fetch organisation',
            statusCode: 500
        });
    }
});

router.post('/organisations', async (req, res) => {
    const { name, description } = req.body;

    try {
        const organisation = await prisma.organisation.create({
            data: {
                name,
                description,
                users: { connect: { userId: req.user.userId } } // Assuming req.user is set after token validation
            }
        });

        res.status(201).json({
            status: 'success',
            message: 'Organisation created successfully',
            data: { organisation }
        });
    } catch (error) {
        console.error('Error creating organisation:', error);
        res.status(400).json({
            status: 'Bad request',
            message: 'Organisation creation failed',
            statusCode: 400
        });
    }
});

router.post('/organisations/:orgId/users', async (req, res) => {
    const { userId } = req.body;
    const { orgId } = req.params;

    try {
        await prisma.organisation.update({
            where: { orgId },
            data: { users: { connect: { userId } } }
        });

        res.status(200).json({
            status: 'success',
            message: 'User added to organisation successfully'
        });
    } catch (error) {
        console.error('Error adding user to organisation:', error);
        res.status(400).json({
            status: 'Bad request',
            message: 'Failed to add user to organisation',
            statusCode: 400
        });
    }
});

module.exports = router;
