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
                message: '
