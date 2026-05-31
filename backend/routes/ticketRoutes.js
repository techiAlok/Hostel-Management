const express = require('express');
const router = express.Router();
// 🚀 FIXED: cancelTicket ko yahan list mein add kiya
const { createTicket, getAllTickets, resolveTicket, cancelTicket } = require('../controllers/ticketController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Student ticket banayega
router.post('/', protect, createTicket);

// 🚀 FIXED: Student aur admin dono is endpoint ko hit kar sakte hain securely
router.get('/', protect, getAllTickets);

// Sirf admin aur superadmin hi resolve kar sakte hain
router.put('/:id/resolve', protect, authorizeRoles('admin', 'superadmin'), resolveTicket);

router.patch('/:id/cancel', protect, cancelTicket); // 'protect' aapka auth middleware hai

module.exports = router;