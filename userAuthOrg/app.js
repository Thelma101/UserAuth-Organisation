
const express = require('express');
const validationRoutes = require('./middleware/validation');
const authenticateToken = require('./middleware/authenticateToken');
const authController = require('../controllers/authController');
const authenticateJWT = require('../middleware/authenticateJWT');

const app = express();
app.use(express.json());

app.use('/auth', validationRoutes);

// Use the authenticateToken middleware for protected routes
app.use(authenticateToken);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});










// const express = require('express');
// const { PrismaClient } = require('@prisma/client');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// const prisma = new PrismaClient();
// const app = express();

// const secret = 'your_jwt_secret';
// const saltRounds = 10;

// app.use(express.json());

// // User Registration
// app.post('/auth/register', async (req, res) => {
//     const { firstName, lastName, email, password, phone } = req.body;

//     // Validate required fields
//     if (!firstName || !lastName || !email || !password) {
//         return res.status(422).json({
//             errors: [
//                 { field: 'firstName', message: 'First name is required' },
//                 { field: 'lastName', message: 'Last name is required' },
//                 { field: 'email', message: 'Email is required' },
//                 { field: 'password', message: 'Password is required' }
//             ]
//         });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     try {
//         // Create user and default organisation
//         const user = await prisma.user.create({
//             data: {
//                 firstName,
//                 lastName,
//                 email,
//                 password: hashedPassword,
//                 phone
//             }
//         });

//         const defaultOrgName = `${firstName}'s Organisation`;
//         const organisation = await prisma.organisation.create({
//             data: {
//                 name: defaultOrgName,
//                 // Optional: Add description if needed
//             }
//         });

//         // Respond with access token and user data
//         const accessToken = jwt.sign({ userId: user.userId }, secret);
//         res.status(201).json({
//             status: 'success',
//             message: 'Registration successful',
//             data: {
//                 accessToken,
//                 user
//             }
//         });
//     } catch (error) {
//         console.error('Error during registration:', error);
//         res.status(400).json({
//             status: 'Bad request',
//             message: 'Registration unsuccessful',
//             statusCode: 400
//         });
//     }
// });

// // User Login
// app.post('/auth/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await prisma.user.findUnique({
//             where: {
//                 email
//             }
//         });

//         if (!user || !(await bcrypt.compare(password, user.password))) {
//             return res.status(401).json({
//                 status: 'error',
//                 message: 'Authentication failed',
//                 statusCode: 401
//             });
//         }

//         // Generate access token
//         const accessToken = jwt.sign({ userId: user.userId }, secret);
//         res.status(200).json({
//             status: 'success',
//             message: 'Login successful',
//             data: {
//                 accessToken,
//                 user
//             }
//         });
//     } catch (error) {
//         console.error('Error during login:', error);
//         res.status(500).json({
//             status: 'Internal server error',
//             message: 'Login failed',
//             statusCode: 500
//         });
//     }
// });

// // Get user by ID (Protected endpoint)
// app.get('/api/users/:id', authenticateToken, async (req, res) => {
//     try {
//         const user = await prisma.user.findUnique({
//             where: {
//                 userId: req.params.id
//             }
//         });

//         if (!user) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'User not found',
//                 statusCode: 404
//             });
//         }

//         res.status(200).json({
//             status: 'success',
//             data: user
//         });
//     } catch (error) {
//         console.error('Error fetching user:', error);
//         res.status(500).json({
//             status: 'Internal server error',
//             message: 'Failed to fetch user',
//             statusCode: 500
//         });
//     }
// });

// // Get all organisations (Protected endpoint)
// app.get('/api/organisations', authenticateToken, async (req, res) => {
//     try {
//         const organisations = await prisma.organisation.findMany();

//         res.status(200).json({
//             status: 'success',
//             data: {
//                 organisations
//             }
//         });
//     } catch (error) {
//         console.error('Error fetching organisations:', error);
//         res.status(500).json({
//             status: 'Internal server error',
//             message: 'Failed to fetch organisations',
//             statusCode: 500
//         });
//     }
// });

// // Get organisation by ID (Protected endpoint)
// app.get('/api/organisations/:orgId', authenticateToken, async (req, res) => {
//     try {
//         const organisation = await prisma.organisation.findUnique({
//             where: {
//                 orgId: req.params.orgId
//             }
//         });

//         if (!organisation) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'Organisation not found',
//                 statusCode: 404
//             });
//         }

//         res.status(200).json({
//             status: 'success',
//             data: organisation
//         });
//     } catch (error) {
//         console.error('Error fetching organisation:', error);
//         res.status(500).json({
//             status: 'Internal server error',
//             message: 'Failed to fetch organisation',
//             statusCode: 500
//         });
//     }
// });

// // Create organisation (Protected endpoint)
// app.post('/api/organisations', authenticateToken, async (req, res) => {
//     const { name, description } = req.body;

//     // Validate required fields
//     if (!name) {
//         return res.status(422).json({
//             errors: [
//                 { field: 'name', message: 'Organisation name is required' }
//             ]
//         });
//     }

//     try {
//         const organisation = await prisma.organisation.create({
//             data: {
//                 name,
//                 description
//             }
//         });

//         res.status(201).json({
//             status: 'success',
//             message: 'Organisation created successfully',
//             data: organisation
//         });
//     } catch (error) {
//         console.error('Error creating organisation:', error);
//         res.status(500).json({
//             status: 'Internal server error',
//             message: 'Failed to create organisation',
//             statusCode: 500
//         });
//     }
// });

// // Middleware to authenticate JWT token
// function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (token == null) {
//         return res.status(401).json({
//             status: 'error',
//             message: 'Authentication token required',
//             statusCode: 401
//         });
//     }

//     jwt.verify(token, secret, (err, user) => {
//         if (err) {
//             return res.status(403).json({
//                 status: 'error',
//                 message: 'Invalid token',
//                 statusCode: 403
//             });
//         }
//         req.user = user;
//         next();
//     });
// }

// const port = process.env.PORT || 3000;

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });






// // const express = require('express');
// // const { PrismaClient } = require('@prisma/client');
// // const bcrypt = require('bcrypt');
// // const jwt = require('jsonwebtoken');
// // const prisma = new PrismaClient();
// // const { validateUser, validateLogin } = require('../middleware/validation');


// // const app = express();
// // app.use(express.json());

// // const secret = 'your_jwt_secret';
// // const saltRounds = 10;
// // app.use(express.json());

// // app.config = {
// //     port: 3000
// // }

// // app.get('/', (req, res) => {
// //     res.send('Hello World!');
// // });

// // app.post('/auth/register', async (req, res) => {
// //     const { firstName, lastName, email, password, phone } = req.body;
// //     const hashedPassword = await bcrypt.hash(password, saltRounds);
// //     const user = await prisma.user.create({
// //         data: {
// //             firstName,
// //             lastName,
// //             email,
// //             password: hashedPassword,
// //             phone
// //         }
// //     });
// //     res.status(201).json({
// //         status: 'success',
// //         message: 'Registration successful',
// //         data: {
// //             accessToken: jwt.sign({ userId: user.userId }, secret),
// //             user
// //         }
// //     });
// // });
// // app.post('/auth/login', async (req, res) => {
// //     const { email, password } = req.body;
// //     const user = await prisma.user.findUnique({
// //         where: {
// //             email
// //         }
// //     });
// //     if (!user) {
// //         return res.status(401).json({
// //             status: 'error',
// //             message: 'Invalid email or password',
// //             statusCode: 401
// //         });
// //     }
// // });

// // app.get('/api/users/:id', async (req, res) => {
// //     const user = await prisma.user.findUnique({
// //         where: {
// //             userId: req.params.id
// //         }
// //     });
// //     if (!user) {
// //         return res.status(404).json({
// //             status: 'error',
// //             message: 'User not found',
// //             statusCode: 404
// //         });
// //     }
// //     res.status(200).json({
// //         status: 'success',
// //         data: user
// //     });
// // });

// // app.get('/api/organisations', async (req, res) => {
// //     const organisations = await prisma.organisation.findMany();
// //     res.status(200).json({
// //         status: 'success',
// //         data: organisations
// //     });
// // });

// // app.get('/api/organisations/:orgId', async (req, res) => {
// //     const organisation = await prisma.organisation.findUnique({
// //         where: {
// //             orgId: req.params.orgId
// //         }
// //     });
// //     if (!organisation) {
// //         return res.status(404).json({
// //             status: 'error',
// //             message: 'Organisation not found',
// //             statusCode: 404
// //         });
// //     }
// // });

// // res.status(200).json({
// //     status: 'success',
// //     data: organisation
// // });


// // const port = app.config.port || 3000;

// // app.listen(port, () => {
// //     console.log(`Server is running on port ${port}`)
// // });


// // Endpoints:
// // * 		[POST] /auth/register Registers a users and creates a default organisation Register request body:
// // {
// // 	"firstName": "string",
// // 	"lastName": "string",
// // 	"email": "string",
// // 	"password": "string",
// // 	"phone": "string",
// // }
// // Successful response: Return the payload below with a 201 success status code.
// // {
// //     "status": "success",
// //     "message": "Registration successful",
// //     "data": {
// //       "accessToken": "eyJh...",
// //       "user": {
// // 	      "userId": "string",
// // 	      "firstName": "string",
// // 				"lastName": "string",
// // 				"email": "string",
// // 				"phone": "string",
// //       }
// //     }
// // }
// // Unsuccessful registration response:
// // {
// //     "status": "Bad request",
// //     "message": "Registration unsuccessful",
// //     "statusCode": 400
// // }
// // * 		[POST] /auth/login : logs in a user. When you log in, you can select an organisation to interact with
// // Login request body:
// // {
// // 	"email": "string",
// // 	"password": "string",
// // }
// // Successful response: Return the payload below with a 200 success status code.
// // {
// //     "status": "success",
// //     "message": "Login successful",
// //     "data": {
// //       "accessToken": "eyJh...",
// //       "user": {
// // 	      "userId": "string",
// // 	      "firstName": "string",
// // 				"lastName": "string",
// // 				"email": "string",
// // 				"phone": "string",
// //       }
// //     }
// // }
// // Unsuccessful login response:
// // {
// //     "status": "Bad request",
// //     "message": "Authentication failed",
// //     "statusCode": 401
// // }
// // * 		[GET] /api/users/:id : a user gets their own record or user record in organisations they belong to or created [PROTECTED].
// // Successful response: Return the payload below with a 200 success status code.
// // {
// // 		"status": "success",
// //     "message": "<message>",
// //     "data": {
// //       "userId": "string",
// //       "firstName": "string",
// // 			"lastName": "string",
// // 			"email": "string",
// // 			"phone": "string"
// //     }
// // }