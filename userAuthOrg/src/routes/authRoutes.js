// Define routes (authRoutes.js and userRoutes.js) for handling different endpoints:
// /auth/register: Register a user and create a default organization.
// /auth/login: Authenticate a user and return a JWT token.
// /api/users/:id: Get user details (protected endpoint).
// /api/organisations: Get all organizations for the logged-in user (protected endpoint).
// /api/organisations/:orgId: Get details of a specific organization (protected endpoint).
// /api/organisations: Create a new organization (protected endpoint).
// /api/organisations/:orgId/users: Add a user to a specific organization (protected endpoint).


const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const organisationRoutes = require('./organisationRoutes');

router.use('/auth', authRoutes);

router.use('/api/users', userRoutes);

router.use('/api/organisations', organisationRoutes);

module.exports = router;

