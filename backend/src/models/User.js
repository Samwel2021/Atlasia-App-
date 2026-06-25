const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: String,
  fullName: String,
  portalType: {
    type: String,
    enum: ['admin', 'customer', 'transporter'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending_approval', 'approved', 'rejected', 'active', 'inactive'],
    default: 'pending_approval'
  },
  profile: {
    companyName: String,
    address: String,
    city: String,
    country: String,
    profileImage: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
