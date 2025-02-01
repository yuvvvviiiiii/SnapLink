const mongoose = require('mongoose');

const shortUrlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
    unique: true
  },
  hashedUrl: {
    type: String,
    required: true,
    unique: true,
  },
  remarks: {
    type: String,
    required: true
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  expirationDate: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  clicks: {
    type: Number,
    default: 0,
  },
  ipAddress: {
    type: String,
  },
  userDevice: {
    type: String,
  }
});

module.exports = mongoose.model('ShortUrlSchema', shortUrlSchema);