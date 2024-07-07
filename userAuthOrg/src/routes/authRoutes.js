const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const { validateUserFields, validateLoginFields } = require('../middleware/validation');
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const saltRounds = 10;
const secret = process.env.JWT_SECRET || 'your_jwt_secret';

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const organisationName = `${firstName}'s Organisation`;

    // Check if organisation exists or create it
    let organisation = await prisma.organisation.findFirst({
      where: { name: organisationName },
    });

    if (!organisation) {
      organisation = await prisma.organisation.create({
        data: { name: organisationName },
      });
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        organisations: {
          connectOrCreate: {
            where: {
              userId_organisationId: {
                userId: '',
                organisationId: organisation.orgId,
              },
            },
            create: {
              userId: '',
              organisationId: organisation.orgId,
            },
          },
        },
      },
    });

    // Generate JWT token
    const accessToken = jwt.sign({ userId: newUser.userId }, secret);

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        accessToken,
        user: {
          id: newUser.userId,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          phone: newUser.phone,
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
  } finally {
    await prisma.$disconnect();
  }
});

module.exports = router;
