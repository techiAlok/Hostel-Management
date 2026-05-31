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

// Delete Student profile & update room bed occupancy properties
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // 🚀 FIXED FIELD SYNC: Increment vacancies counter when a resident gets removed
    if (student.roomId) {
      const Room = require('../models/Room');
      await Room.findByIdAndUpdate(student.roomId, { $inc: { vacancies: 1 } });
    }

    const User = require('../models/User');
    await User.findByIdAndDelete(student.userId);
    await student.deleteOne();

    res.json({ message: 'Student profile removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current logged-in student profile
// @route   GET /api/students/me
const getStudentProfile = async (req, res) => {
  try {
    // 1. Student document fetch kijiye aur uske roomId ko populate kijiye
    const student = await Student.findOne({ userId: req.user._id }).populate('roomId');
    
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // 2. 🚀 ALIGNING RESPONSE WITH YOUR FRONTEND STRUCTURE
    // Aapka frontend format dhyan se dekho: profileData?.profile?.phone aur profileData?.room?.roomNumber
    res.json({
      profile: student,               // Isme student document aur phone aayega
      room: student.roomId || null,   // Isme populated room object aayega jisme roomNumber hoga
      roommates: []                   // Standby empty array taaki roommates loop handle ho sake
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllStudents, deleteStudent, getStudentProfile };