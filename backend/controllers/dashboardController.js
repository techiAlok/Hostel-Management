const Student = require('../models/Student');
const Room = require('../models/Room');
const Ticket = require('../models/Ticket'); // 🚀 SAFELY IMPORTED TICKET MODEL

const getDashboardStats = async (req, res) => {
  try {
    const totalResidents = await Student.countDocuments({});
    
    // Live Pending Tickets Count
    const pendingTickets = await Ticket.countDocuments({ status: 'Pending' });

    const roomMetrics = await Room.aggregate([
      {
        $group: {
          _id: null,
          totalCapacity: { $sum: "$capacity" },
          totalOccupied: { $sum: "$occupiedBeds" }
        }
      }
    ]);

    const capacityData = roomMetrics[0] || { totalCapacity: 0, totalOccupied: 0 };
    const availableVacancies = Math.max(0, capacityData.totalCapacity - capacityData.totalOccupied);

    res.json({
      totalResidents,
      availableVacancies,
      pendingTickets // 🚀 AB YEH STATIC 0 NAHI HAI, LIVE RECONCILIATION HAI!
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };