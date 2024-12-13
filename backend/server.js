import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Import the User model
import User from './models/User.js';

// POST route to send user data to the database
app.post('/users', async (req, res) => {
  try {
    const { name, email, age } = req.body;

    // Validate input
    if (!name || !email || !age) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Create a new user document
    const newUser = new User({ name, email, age });

    // Save the document to the database
    const savedUser = await newUser.save();
    res.status(201).json({ success: true, data: savedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error saving user', error: error.message });
  }
});

// Default route for unmatched paths
app.use((req, res) => {
  res.status(404).send('Route not found');
});

// Start the server
app.listen(port, () => console.log(`Server running on port ${port}`));
