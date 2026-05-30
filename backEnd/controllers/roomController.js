const Room = require('../models/Room');

// Create a new room (Admin only)
const createRoom = async (req, res) => {
  const { roomNumber, capacity } = req.body;
  try {
    const roomExists = await Room.findOne({ roomNumber });
    if (roomExists) return res.status(400).json({ message: 'Room already exists' });

    const room = await Room.create({ roomNumber, capacity });
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

// Allocate Room atomically to prevent race conditions
const allocateRoom = async (req, res) => {
  const { studentId, roomId } = req.body;
  try {
    const targetRoom = await Room.findById(roomId);
    if (!targetRoom) return res.status(404).json({ message: 'Room not found' });

    if (targetRoom.occupiedBeds >= targetRoom.capacity) {
      return res.status(400).json({ message: 'Room is fully occupied' });
    }

    const Student = require('../models/Student');
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student profile not found' });
    
    if (student.roomId) return res.status(400).json({ message: 'Student is already allocated to a room' });

    // Atomically increment occupied count only if space is free
    const updatedRoom = await Room.findOneAndUpdate(
      { _id: roomId, occupiedBeds: { $lt: targetRoom.capacity } },
      { $inc: { occupiedBeds: 1 } },
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