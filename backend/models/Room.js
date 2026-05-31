const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  vacancies: {
    type: Number,
    required: true // 🚀 CRITICAL: This allows mongoose to process your atomic updates!
  },
  occupants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    default: []
  }]
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);