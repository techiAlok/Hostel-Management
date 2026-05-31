const express = require('express');
const router = express.Router();
const { getAllStudents, deleteStudent, getStudentProfile } = require('../controllers/studentController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware'); 

// 🚀 FIXED PATH MATCHING: Endpoints ko direct front-end calling array hooks se jod diya
router.get('/', protect, authorizeRoles('admin', 'superadmin'), getAllStudents);
router.delete('/:id', protect, authorizeRoles('admin', 'superadmin'), deleteStudent);

// Frontend '/api/students/me' hit kar raha hai, toh base server routing ke mutabik yahan '/me' aayega
router.get('/me', protect, getStudentProfile);

module.exports = router;