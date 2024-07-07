// models/User.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

const User = {
  async createUser(firstName, lastName, email, password, phone) {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          phone,
          organisations: {
            create: {
              organisation: {
                create: {
                  name: `${firstName}'s Organisation`,
                },
              },
            },
          },
        },
        include: {
          organisations: true,
        },
      });
      return user;
    } catch (error) {
      if (error.code === 'P2002') { // Prisma unique constraint violation error code
        throw new Error('User with this email already exists');
      }
      throw new Error('Could not create user');
    }
  },

  async findUserByEmail(email) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error('User not found');
    }
  },

  async findUserById(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { userId },
      });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error('User not found');
    }
  },
};

module.exports = User;
