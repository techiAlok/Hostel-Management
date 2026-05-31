const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// 🚀 FIXED: Array brackets [] hata diye, ab direct strings pass ho rahi hain
router.get('/stats', protect, authorizeRoles('admin', 'superadmin'), getDashboardStats);

module.exports = router;