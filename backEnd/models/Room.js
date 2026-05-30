const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: true
  },
  occupiedBeds: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);