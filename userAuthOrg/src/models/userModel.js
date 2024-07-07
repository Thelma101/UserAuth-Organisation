const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

const userModel = {
  async createUser(firstName, lastName, email, password, phone) {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const organisation = await prisma.organisations.findFirst({
        where: { name: `${firstName}'s Organisation` },
      });
      if (!organisation) {
        organisation = await prisma.organisations.create({ data: { name: `${firstName}'s Organisation` } });
      }
      const user = await prisma.users.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          phone,
          user_organisations: {
            create: {
              organisationId: organisation.id,
            },
          },
        },
        include: {
          user_organisations: {
            include: {
              organisation: true,
            },
          },
        },
      });
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        return { error: 'User with this email already exists' };
      }
      throw error;
    }
  },

  async findUserByEmail(email) {
    try {
      const user = await prisma.users.findUnique({
        where: { email },
        include: {
          user_organisations: {
            include: {
              organisation: true,
            },
          },
        },
      });
      if (!user) {
        return { error: 'User not found' };
      }
      return user;
    } catch (error) {
      throw new Error('User not found');
    }
  },
};

module.exports = userModel;