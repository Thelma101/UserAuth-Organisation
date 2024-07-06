const User = require('./models/index').User;

const testUserModel = async () => {
  try {
    const newUser = await User.create({
      userId: 'uniqueUserId123',
      firstName: 'Tee',
      lastName: 'Kennedy',
      email: 'tee.ken@example.com',
      password: '123456',
      phone: '123-456-7890',
    });
    console.log('User created successfully:', newUser.toJSON());
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

testUserModel();
