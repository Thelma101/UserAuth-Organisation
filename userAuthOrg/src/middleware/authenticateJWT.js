const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const secret = 'your_jwt_secret'; // Replace with your actual secret key

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'Authentication token required',
            statusCode: 401
        });
    }

    jwt.verify(token, secret, async (err, decoded) => {
        if (err) {
            return res.status(403).json({
                status: 'error',
                message: 'Forbidden',
                statusCode: 403
            });
        }
        
        const user = await prisma.user.findUnique({
            where: { userId: decoded.userId }
        });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
                statusCode: 404
            });
        }

        req.user = user;
        next();
    });
};

module.exports = authenticateJWT;
