const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  roomType: {
    type: String,
    enum: ['customer_admin', 'transporter_admin', 'admin_support'],
    required: true
  },
  participants: [{
    userId: String,
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
