const Student = require('../models/Student');

// Get all student profiles populated with User and Room details
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({})
      .populate('userId', '-password')
      .populate('roomId');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Student profile & update room bed occupancy
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Free up room capacity if they were assigned somewhere
    if (student.roomId) {
      const Room = require('../models/Room');
      await Room.findByIdAndUpdate(student.roomId, { $inc: { occupiedBeds: -1 } });
    }

    const User = require('../models/User');
    await User.findByIdAndDelete(student.userId);
    await student.deleteOne();

    res.json({ message: 'Student profile removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllStudents, deleteStudent };

// Get current logged-in student profile
const getStudentProfile = async (req, res) => {
  try {
    // Find student matching the req.user._id attached by protect middleware
    const student = await Student.findOne({ userId: req.user._id }).populate('roomId');
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update your module.exports at the bottom to include it:
module.exports = { getAllStudents, deleteStudent, getStudentProfile };