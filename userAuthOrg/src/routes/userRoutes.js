// routes/userRoutes.js

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const User = require('../models/userModel');
const Organisation = require('../models/Organisation'); // Assuming you have an Organisation model
const router = express.Router();
const prisma = new PrismaClient();

const secret = 'your_jwt_secret_key'; // Replace with your actual secret key

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(422).json({
            errors: [
                { field: 'firstName', message: 'First name is required' },
                { field: 'lastName', message: 'Last name is required' },
                { field: 'email', message: 'Email is required' },
                { field: 'password', message: 'Password is required' },
            ]
        });
    }

    try {
        const user = await User.createUser(firstName, lastName, email, password, phone);

        const organisationName = `${firstName}'s Organisation`;
        await Organisation.createOrganisation(user.userId, organisationName);

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
        res.status(400).json({
            status: 'Bad request',
            message: 'Registration unsuccessful',
            statusCode: 400
        });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({
            errors: [
                { field: 'email', message: 'Email is required' },
                { field: 'password', message: 'Password is required' }
            ]
        });
    }

    try {
        const user = await User.findUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password',
                statusCode: 401
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
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
        res.status(400).json({
            status: 'Bad request',
            message: 'Authentication failed',
            statusCode: 400
        });
    }
});

router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findUserById(req.params.id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
                statusCode: 404
            });
        }

        res.status(200).json({
            status: 'success',
            data: user
        });
    } catch (error) {
        res.status(400).json({
            status: 'Bad request',
            message: 'Could not fetch user data',
            statusCode: 400
        });
    }
});

module.exports = router;
