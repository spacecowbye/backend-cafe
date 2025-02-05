// src/server.js
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js'; // Import auth routes

dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Use auth routes
app.use('/api/auth', authRoutes);

// Set the server port (e.g., 5000)
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
