const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const dotEnv = require("dotenv");
const routes=require('./routes/AllRoutes')
dotEnv.config();

// Initialize app
const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for frontend communication

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Define Student Schema
const studentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  parentName: String,
  previousSchool: String,
  previousClass: String,
  presentClass: String,
  term1: Number,
  term2: Number,
  term3: Number,
  role:String,
  password: String, // New field for password
  photoFile: String, // Path to the uploaded photo file
});

// Student Model
const Student = mongoose.model('Student', studentSchema);

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage });

// Add a new student with a password and photo
app.post('/students', upload.single('photoFile'), async (req, res) => {
  try {
    const { firstName, lastName, parentName, previousSchool, previousClass, presentClass, term1, term2, term3, password } = req.body;
    
    // Encrypt the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      firstName,
      lastName,
      parentName,
      previousSchool,
      previousClass,
      presentClass,
      term1,
      term2,
      term3,
      password: hashedPassword,
      photoFile: req.file ? req.file.filename : null, // Save filename if photo was uploaded
    });

    await student.save();
    res.status(201).json({ message: 'Student added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding student' });
  }
});

// Fetch all students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching students' });
  }
});

// Serve uploaded images
app.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  fs.exists(filePath, exists => {
    if (exists) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  });
});


// Update a student by ID
app.put('/students/:id', upload.single('photoFile'), async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, parentName, previousSchool, previousClass, presentClass, term1, term2, term3, password } = req.body;

    const updateData = {
      firstName,
      lastName,
      parentName,
      previousSchool,
      previousClass,
      presentClass,
      term1,
      term2,
      term3,
    };

    // Hash the password if it is being updated
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update the photo file if provided
    if (req.file) {
      updateData.photoFile = req.file.filename;
    }

    await Student.findByIdAndUpdate(id, updateData);
    res.status(200).json({ message: 'Student updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating student' });
  }
});

// Delete a student by ID
app.delete('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting student' });
  }
});

app.use('/api',routes );

// Start server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
 