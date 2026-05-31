const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getPendingAdmins,  
  handleAdminApproval 
} = require('../controllers/authController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// 🚀 FIXED PATH MATCHING: Frontend ke authorize-admin URL ke sath match kiya
router.get('/pending-admins', protect, authorizeRoles('superadmin'), getPendingAdmins);
router.put('/authorize-admin/:id', protect, authorizeRoles('superadmin'), handleAdminApproval);

module.exports = router;