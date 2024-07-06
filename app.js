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
            password:  hashedPassword,
            phone
        }
    });
    res.status(201).json({
        status:'success',
        message: 'Registration successful',
        data: {
            accessToken: jwt.sign({ userId: user.userId }, secret),
            user
        }
    });
});




const port = app.config.port || 3000;

// app.post('/auth/register', (req,res) => {
//     res.status(200).json({
//         message: 'User registered successfully'
//     })
// });

// app.post('/auth/login', (req, res) => {
//     res.status(200).json({
//         message: 'User logged in successfully'
//     })
// });


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