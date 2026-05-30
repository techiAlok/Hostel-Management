const express = require('express');
const router = express.Router();
const { getAllStudents, deleteStudent, getStudentProfile } = require('../controllers/studentController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Public student profile route for authenticated students
router.get('/me', protect, getStudentProfile);

// Admin only routes
router.get('/', protect, authorizeRoles('admin'), getAllStudents);
router.delete('/:id', protect, authorizeRoles('admin'), deleteStudent);

module.exports = router;