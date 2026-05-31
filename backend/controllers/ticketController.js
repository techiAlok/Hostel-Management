const Ticket = require('../models/Ticket');

// @desc    Student naya ticket raise karega
// @route   POST /api/tickets
const createTicket = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const ticket = await Ticket.create({
      studentId: req.user._id,
      title,
      description,
      category
    });
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get tickets (All for Admin, User-specific for Student)
// @route   GET /api/tickets
const getAllTickets = async (req, res) => {
  try {
    let tickets;
    if (req.user.role === 'admin' || req.user.role === 'superadmin') {
      tickets = await Ticket.find({}).populate('studentId', 'name email').sort({ createdAt: -1 });
    } else {
      tickets = await Ticket.find({ studentId: req.user._id }).populate('studentId', 'name email').sort({ createdAt: -1 });
    }
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin ticket resolve karega
// @route   PUT /api/tickets/:id/resolve
const resolveTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status: 'Resolved' },
      { new: true }
    );
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Student ticket cancel karega (Status Update)
// @route   PATCH /api/tickets/:id/cancel
const cancelTicket = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. Pehle normal find karo validation checks ke liye
    const checkTicket = await Ticket.findById(id);
    if (!checkTicket) {
      return res.status(404).json({ success: false, message: "Ticket nahi mila!" });
    }

    // 2. Safe check mapping for user verification
    const ticketStudentId = checkTicket.studentId._id 
      ? checkTicket.studentId._id.toString() 
      : checkTicket.studentId.toString();

    if (ticketStudentId !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Aap ye ticket cancel nahi kar sakte!" });
    }

    if (checkTicket.status !== 'Pending') {
      return res.status(400).json({ success: false, message: "In-Progress ya Resolved ticket cancel nahi ho sakta!" });
    }

    // 🚀 ATOMIC FIX: `.save()` ki jagah direct DB query update call fire karenge
    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { $set: { status: 'Cancelled' } },
      { new: true, runValidators: false } // Hooks bypass taaki crash na ho
    );

    res.status(200).json({ 
      success: true, 
      message: "Ticket successfully cancel ho gaya!", 
      ticket: updatedTicket 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error!", error: error.message });
  }
};
module.exports = { createTicket, getAllTickets, resolveTicket, cancelTicket };