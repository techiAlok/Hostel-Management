const express = require('express');
const router = express.Router();
const { createRoom, getRooms, allocateRoom } = require('../controllers/roomController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware'); 

// 🚀 FIXED: Har jagah se brackets hataye, direct string array parameters
router.post('/', protect, authorizeRoles('admin', 'superadmin'), createRoom);
router.get('/', protect, authorizeRoles('admin', 'superadmin'), getRooms);
router.post('/allocate', protect, authorizeRoles('admin', 'superadmin'), allocateRoom); 

module.exports = router;