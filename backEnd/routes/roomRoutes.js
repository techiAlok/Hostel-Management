const express = require('express');
const router = express.Router();
const { createRoom, getRooms, allocateRoom } = require('../controllers/roomController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, authorizeRoles('admin'), createRoom)
  .get(protect, getRooms);

router.put('/allocate', protect, authorizeRoles('admin'), allocateRoom);

module.exports = router;