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
        },
      });
      return user;
    } catch (error) {
      throw new Error('Could not create user');
    }
  },

  async findUserByEmail(email) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      return user;
    } catch (error) {
      throw new Error('User not found');
    }
  },

  async findUserById(id) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      return user;
    } catch (error) {
      throw new Error('User not found');
    }
  },
};

module.exports = User;
