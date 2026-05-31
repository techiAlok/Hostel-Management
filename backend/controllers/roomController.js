const Room = require('../models/Room');
const Student = require('../models/Student');

// Create a new room (Admin only)
const createRoom = async (req, res) => {
  const { roomNumber, capacity } = req.body;
  try {
    const roomExists = await Room.findOne({ roomNumber });
    if (roomExists) return res.status(400).json({ message: 'Room already exists' });

    const room = await Room.create({ 
      roomNumber, 
      capacity: Number(capacity), 
      vacancies: Number(capacity) // Correct initialization field
    });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all rooms
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Allocate Room atomically based on available vacancies field tracking
const allocateRoom = async (req, res) => {
  const { studentId, roomId } = req.body;
  try {
    const targetRoom = await Room.findById(roomId);
    if (!targetRoom) return res.status(404).json({ message: 'Room not found' });

    if (targetRoom.vacancies <= 0) {
      return res.status(400).json({ message: 'Room is fully occupied' });
    }

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student profile not found' });
    
    if (student.roomId) return res.status(400).json({ message: 'Student is already allocated to a room' });

    // 🚀 FIXED ATOMIC WRITE: Decrement the vacancies counter property cleanly!
    const updatedRoom = await Room.findOneAndUpdate(
      { _id: roomId, vacancies: { $gt: 0 } },
      { $inc: { vacancies: -1 } },
      { new: true }
    );

    if (!updatedRoom) return res.status(400).json({ message: 'Room filled up just now!' });

    student.roomId = roomId;
    await student.save();

    res.json({ message: 'Room allocated successfully', updatedRoom });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRoom, getRooms, allocateRoom };