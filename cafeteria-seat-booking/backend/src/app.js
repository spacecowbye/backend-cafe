
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json()); // To parse JSON request bodies

// Use auth routes
app.use('/auth', authRoutes);

// Define other routes and middleware here...

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
