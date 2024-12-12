import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Initialize dotenv to load environment variables from .env
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Use middleware to parse incoming JSON requests
app.use(express.json());

// Simple test route
app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});

// Define the User model
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model('User', UserSchema);

// GET route to fetch all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();  // Find all users in the database
    res.status(200).json(users);  // Respond with all users in the database
  } catch (err) {
    res.status(400).json({ message: 'Error fetching users', error: err });
  }
});

// POST route to create a new user
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const newUser = new User({ name, email });
    await newUser.save();  // Save the new user to the database
    res.status(201).json(newUser);  // Respond with the newly created user
  } catch (err) {
    res.status(400).json({ message: 'Error creating user', error: err });
  }
});

// Connect to MongoDB Atlas using the URI from the .env file
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
