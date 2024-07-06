const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const app = express();
app.use(express.json());

const secret = 'your_jwt_secret';
const saltRounds = 10;
app.use(express.json());

app.config = {
    port: 3000
}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/auth/register', async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await prisma.user.create({
        data: {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone
        }
    });
    res.status(201).json({
        status: 'success',
        message: 'Registration successful',
        data: {
            accessToken: jwt.sign({ userId: user.userId }, secret),
            user
        }
    });
});
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });
    if (!user) {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid email or password',
            statusCode: 401
        });
    }
});

app.get('/api/users/:id', async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            userId: req.params.id
        }
    });
    if (!user) {
        return res.status(404).json({
            status: 'error',
            message: 'User not found',
            statusCode: 404
        });
    }
    res.status(200).json({
        status: 'success',
        data: user
    });
});

app.get('/api/organisations', async (req, res) => {
    const organisations = await prisma.organisation.findMany();
    res.status(200).json({
        status: 'success',
        data: organisations
    });
});

app.get('/api/organisations/:orgId', async (req, res) => {
    const organisation = await prisma.organisation.findUnique({
        where: {
            orgId: req.params.orgId
        }
    });
    if (!organisation) {
        return res.status(404).json({
            status: 'error',
            message: 'Organisation not found',
            statusCode: 404
        });
    }});

const port = app.config.port || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});


// Endpoints:
// * 		[POST] /auth/register Registers a users and creates a default organisation Register request body:
// {
// 	"firstName": "string",
// 	"lastName": "string",
// 	"email": "string",
// 	"password": "string",
// 	"phone": "string",
// }
// Successful response: Return the payload below with a 201 success status code.
// {
//     "status": "success",
//     "message": "Registration successful",
//     "data": {
//       "accessToken": "eyJh...",
//       "user": {
// 	      "userId": "string",
// 	      "firstName": "string",
// 				"lastName": "string",
// 				"email": "string",
// 				"phone": "string",
//       }
//     }
// }
// Unsuccessful registration response:
// {
//     "status": "Bad request",
//     "message": "Registration unsuccessful",
//     "statusCode": 400
// }
// * 		[POST] /auth/login : logs in a user. When you log in, you can select an organisation to interact with
// Login request body:
// {
// 	"email": "string",
// 	"password": "string",
// }
// Successful response: Return the payload below with a 200 success status code.
// {
//     "status": "success",
//     "message": "Login successful",
//     "data": {
//       "accessToken": "eyJh...",
//       "user": {
// 	      "userId": "string",
// 	      "firstName": "string",
// 				"lastName": "string",
// 				"email": "string",
// 				"phone": "string",
//       }
//     }
// }
// Unsuccessful login response:
// {
//     "status": "Bad request",
//     "message": "Authentication failed",
//     "statusCode": 401
// }
// * 		[GET] /api/users/:id : a user gets their own record or user record in organisations they belong to or created [PROTECTED].
// Successful response: Return the payload below with a 200 success status code.
// {
// 		"status": "success",
//     "message": "<message>",
//     "data": {
//       "userId": "string",
//       "firstName": "string",
// 			"lastName": "string",
// 			"email": "string",
// 			"phone": "string"
//     }
// }