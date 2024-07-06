const express = require('express');
const routes = require('./routes/indexRoute'); // Adjust the path as necessary

const app = express();

app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



// const express = require('express');
// const validationRoutes = require('./middleware/validation');
// const authenticateToken = require('./middleware/authenticateToken');
// const authController = require('./controllers/authController');
// const authenticateJWT = require('./middleware/authenticateJWT');
// const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');
// const organisationRoutes = require('./organisationRoutes');


// const app = express();
// app.use(express.json());

// app.use('/auth', authController);

// app.get('/api/users/:id', authenticateJWT, async (req, res) => {
//     const { id } = req.params;
//     try {
//         const user = await prisma.user.findUnique({
//             where: { userId: id },
//             include: { organisations: true },
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
//             message: 'User found',
//             data: user,
//         });
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// app.get('/api/organisations', authenticateJWT, async (req, res) => {
//     try {
//         const organisations = await prisma.organisation.findMany({
//             where: { users: { some: { userId: req.user.userId } } },
//         });
//         res.status(200).json({
//             status: 'success',
//             message: 'Organisations retrieved',
//             data: { organisations },
//         });
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// app.get('/api/organisations/:orgId', authenticateJWT, async (req, res) => {
//     const { orgId } = req.params;
//     try {
//         const organisation = await prisma.organisation.findUnique({
//             where: { orgId },
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
//             message: 'Organisation found',
//             data: organisation,
//         });
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// app.post('/api/organisations', authenticateJWT, async (req, res) => {
//     const { name, description } = req.body;
//     if (!name) {
//         return res.status(422).json({
//             errors: [{ field: 'name', message: 'Name is required' }],
//         });
//     }

//     try {
//         const organisation = await prisma.organisation.create({
//             data: {
//                 name,
//                 description,
//                 users: { connect: { userId: req.user.userId } },
//             },
//         });
//         res.status(201).json({
//             status: 'success',
//             message: 'Organisation created successfully',
//             data: organisation,
//         });
//     } catch (error) {
//         res.status(400).json({
//             status: 'Bad Request',
//             message: 'Client error',
//             statusCode: 400
//         });
//     }
// });

// app.post('/api/organisations/:orgId/users', authenticateJWT, async (req, res) => {
//     const { orgId } = req.params;
//     const { userId } = req.body;

//     try {
//         await prisma.organisation.update({
//             where: { orgId },
//             data: { users: { connect: { userId } } },
//         });
//         res.status(200).json({
//             status: 'success',
//             message: 'User added to organisation successfully',
//         });
//     } catch (error) {
//         res.status(400).json({
//             status: 'Bad Request',
//             message: 'Client error',
//             statusCode: 400
//         });
//     }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
