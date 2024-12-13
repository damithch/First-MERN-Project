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

// Define a Mongoose schema and model
const dataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Data = mongoose.model('Data', dataSchema);

// POST route to send data to the database
app.post('/send-data', async (req, res) => {
  try {
    const { name, email, age } = req.body;

    // Validate input
    if (!name || !email || !age) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Create a new document
    const newData = new Data({ name, email, age });

    // Save the document to the database
    const savedData = await newData.save();
    res.status(201).json({ success: true, data: savedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error saving data', error: error.message });
  }
});

// Start the server
app.listen(port, () => console.log(`Server running on port ${port}`));
