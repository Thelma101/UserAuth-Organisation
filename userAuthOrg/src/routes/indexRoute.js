const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const organisationRoutes = require('./organisationRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/organisations', organisationRoutes);

module.exports = router;
