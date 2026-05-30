const Student = require('../models/Student');
const Room = require('../models/Room');

// @desc    Get aggregated management metrics
// @route   GET /api/dashboard/stats
const getDashboardStats = async (req, res) => {
  try {
    // Run database counting queries in parallel
    const totalResidents = await Student.countDocuments({});
    
    // Aggregate total structural bed capacity vs currently occupied beds
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
      pendingTickets: 0 // Mock placeholder for now until complaint schema is added
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };