const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authenticateJWT = require('../middleware/authenticateJWT');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authenticateJWT, async (req, res) => {
    try {
        const organisations = await prisma.organisation.findMany({
            where: { users: { some: { userId: req.user.userId } } },
        });
        res.status(200).json({
            status: 'success',
            message: 'Organisations retrieved',
            data: { organisations },
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:orgId', authenticateJWT, async (req, res) => {
    const { orgId } = req.params;
    try {
        const organisation = await prisma.organisation.findUnique({
            where: { orgId },
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
            message: 'Organisation found',
            data: organisation,
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', authenticateJWT, async (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        return res.status(422).json({
            errors: [{ field: 'name', message: 'Name is required' }],
        });
    }

    try {
        const organisation = await prisma.organisation.create({
            data: {
                name,
                description,
                users: { connect: { userId: req.user.userId } },
            },
        });
        res.status(201).json({
            status: 'success',
            message: 'Organisation created successfully',
            data: organisation,
        });
    } catch (error) {
        res.status(400).json({
            status: 'Bad Request',
            message: 'Client error',
            statusCode: 400
        });
    }
});

router.post('/:orgId/users', authenticateJWT, async (req, res) => {
    const { orgId } = req.params;
    const { userId } = req.body;

    try {
        await prisma.organisation.update({
            where: { orgId },
            data: { users: { connect: { userId } } },
        });
        res.status(200).json({
            status: 'success',
            message: 'User added to organisation successfully',
        });
    } catch (error) {
        res.status(400).json({
            status: 'Bad Request',
            message: 'Client error',
            statusCode: 400
        });
    }
});

module.exports = router;
