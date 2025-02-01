const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  totalClicks: { type: Number, default: 0 },
  clicksByDate: [
    {
      date: { type: String },
      clicks: { type: Number, default: 0 },
    },
  ],
  clicksByDevice: [
    {
      device: {type: String},
      clicks: {type: Number, default: 0}
    }
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
});

module.exports = mongoose.model('Analytics', analyticsSchema);


