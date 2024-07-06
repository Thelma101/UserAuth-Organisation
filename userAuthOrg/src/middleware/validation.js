// validation
const express = require('express');
const router = express.Router();

const validation = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter email and password' });
    }
    next();
    return;
}

router.post('/login', validation, async (req, res) => {
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
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid email or password',
            statusCode: 401
        });
    }
    const accessToken = jwt.sign({ userId: user.userId }, secret);
    res.status(200).json({
        status: 'success',
        data: {
            accessToken,
            user
        }
    });
    return;
});

router.post('/register', validation, async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
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
    return;
});

router.get('/users/:id', async (req, res) => {
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
        data: {
            user
        }
    });
    return;
});


module.exports = validation;

