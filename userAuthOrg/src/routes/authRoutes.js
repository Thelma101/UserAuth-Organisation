const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validateUserFields, validateLoginFields } = require('../middleware/validation');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();
const saltRounds = 10;
const secret = process.env.JWT_SECRET || 'your_jwt_secret';

router.post('/register', validateUserFields, async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const organisationName = `${firstName}'s Organisation`;
    let organisation = await prisma.organisation.findFirst({
      where: { name: organisationName },
    });
    if (!organisation) {
      organisation = await prisma.organisation.create({ data: { name: organisationName } });
    }
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        organisations: {
          connectOrCreate: {
            where: { organisationId: organisation.orgId },
            create: { organisationId: organisation.orgId }
          }
        }
      },
    });
    const accessToken = jwt.sign({ userId: user.userId }, secret);
    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        accessToken,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(400).json({
      status: 'Bad request',
      message: 'Registration unsuccessful',
      statusCode: 400,
    });
  }
});

router.post('/login', validateLoginFields, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { organisations: true },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
        statusCode: 401,
      });
    }

    const accessToken = jwt.sign({ userId: user.userId }, secret);
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      status: 'Internal server error',
      message: 'Login failed',
      statusCode: 500,
    });
  }
});

module.exports = router;
