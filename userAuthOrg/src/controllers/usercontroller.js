const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
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
        data: user
    });
});
module.exports = router;