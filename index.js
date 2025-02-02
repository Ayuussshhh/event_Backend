import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from 'passport';
import './config/passport.js'; // Updated import path

import authRoutes from './routes/auth.route.js';
import eventRoutes from './routes/event.route.js';
import ticketRoutes from './routes/ticket.route.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies
app.use(
  cors({
    origin: 'http://localhost:5173', // Allow frontend to connect
    credentials: true, // Allow cookies and credentials
  })
);

// Passport initialization
app.use(passport.initialize());

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the process if the connection fails
  }
};

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/events', eventRoutes); // Event management routes
app.use('/api/tickets', ticketRoutes); // Ticket management routes

// Health check route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
  connectDB(); // Connect to MongoDB
});