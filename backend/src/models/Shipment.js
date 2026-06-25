const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  customerId: {
    type: String,
    required: true
  },
  transporterId: String,
  originLocation: {
    type: String,
    required: true
  },
  destinationLocation: {
    type: String,
    required: true
  },
  cargoDescription: String,
  weight: Number,
  estimatedDelivery: Date,
  actualDelivery: Date,
  status: {
    type: String,
    enum: ['pending', 'picked_up', 'in_transit', 'delivered', 'cancelled'],
    default: 'pending'
  },
  trackingLocations: [{
    latitude: Number,
    longitude: Number,
    locationName: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Shipment', shipmentSchema);
