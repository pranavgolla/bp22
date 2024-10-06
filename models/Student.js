const mongoose = require('mongoose');

// Define Student Schema
const studentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  parentName: String,
  motherName: String,
  previousSchool: String,
  previousClass: String,
  presentClass: String,
  term1: Number,
  term2: Number,
  term3: Number,
  role: String,
  email: String,
  password: String,
  photoFile: String,
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
