const express = require('express');
const app = express();
const port = app.config.port || 3000;

app.use(express.json());

app.post('/auth/register', (req,res) => {
    res.status(200).json({
        message: 'User registered successfully'
    })
});

app.post('/auth/login', (req, res) => {
    res.status(200).json({
        message: 'User logged in successfully'
    })
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});