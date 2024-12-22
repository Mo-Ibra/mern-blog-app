require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/config');
const app = express();
const port = process.env.PORT || 5000;

const usersRoutes = require('./routes/admin/userRoutes');
const articlesRoutes = require('./routes/articlesRoutes');
const authRoutes = require('./routes/authRoutes');
const commentsRoutes = require('./routes/commentsRoutes');
const jobsRoutes = require('./routes/jobsRoutes');

const articlesAdminRoutes = require('./routes/admin/articleRoutes');
const commentsAdminRoutes = require('./routes/admin/commentsRoutes');

// Root Route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(express.json());
app.use(cors());

const start = async () => {
  try {
    // Sync the database (create tables if they don't exist)
    await sequelize.sync({ alter: true });
  } catch (err) {
    console.log(err)
  }
}
// start();

sequelize.sync();

// Admin Routes
app.use('/admin/users', usersRoutes); // Prefix: admin/users
app.use('/admin/articles', articlesAdminRoutes) // Prefix: admin/articles
app.use('/admin/comments', commentsAdminRoutes) // Prefix: admin/comments

// User Routes
app.use('/auth', authRoutes); // Prefix: /auth
app.use('/articles', articlesRoutes); // Perfix: /articles
app.use('/comments', commentsRoutes); // Prefix: /comments
app.use('/jobs', jobsRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});