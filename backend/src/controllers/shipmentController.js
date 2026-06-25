const { v4: uuidv4 } = require('uuid');
const Shipment = require('../models/Shipment');

exports.createShipment = async (req, res) => {
  try {
    const { originLocation, destinationLocation, cargoDescription, weight, estimatedDelivery } = req.body;

    if (!originLocation || !destinationLocation) {
      return res.status(400).json({ message: 'Origin and destination are required' });
    }

    const shipment = new Shipment({
      id: uuidv4(),
      customerId: req.user.id,
      originLocation,
      destinationLocation,
      cargoDescription,
      weight,
      estimatedDelivery: new Date(estimatedDelivery),
      status: 'pending'
    });

    await shipment.save();
    res.status(201).json({ message: 'Shipment created successfully', shipment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getShipment = async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const shipment = await Shipment.findOne({ id: shipmentId });

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    res.json({ message: 'Shipment details', shipment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getShipmentsByCustomer = async (req, res) => {
  try {
    const shipments = await Shipment.find({ customerId: req.user.id });
    res.json({ message: 'Customer shipments', shipments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getShipmentsByTransporter = async (req, res) => {
  try {
    const shipments = await Shipment.find({ transporterId: req.user.id });
    res.json({ message: 'Transporter shipments', shipments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateShipmentStatus = async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'picked_up', 'in_transit', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const shipment = await Shipment.findOneAndUpdate(
      { id: shipmentId },
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    res.json({ message: 'Shipment status updated', shipment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateTracking = async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const { latitude, longitude, locationName } = req.body;

    const shipment = await Shipment.findOneAndUpdate(
      { id: shipmentId },
      {
        $push: {
          trackingLocations: {
            latitude,
            longitude,
            locationName,
            timestamp: Date.now()
          }
        }
      },
      { new: true }
    );

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    res.json({ message: 'Tracking location updated', shipment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTracking = async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const shipment = await Shipment.findOne({ id: shipmentId });

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    res.json({ message: 'Live tracking data', tracking: shipment.trackingLocations });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
