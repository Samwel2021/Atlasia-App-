const User = require('../models/User');
const Shipment = require('../models/Shipment');

exports.getPendingApprovals = async (req, res) => {
  try {
    const pendingUsers = await User.find({ status: 'pending_approval' });
    res.json({ message: 'Pending approvals', users: pendingUsers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { approved = true } = req.body;

    const status = approved ? 'approved' : 'rejected';
    const user = await User.findOneAndUpdate(
      { id: userId },
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: `User ${status}`, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { portalType, status } = req.query;
    const filter = {};

    if (portalType) filter.portalType = portalType;
    if (status) filter.status = status;

    const users = await User.find(filter);
    res.json({ message: 'All users', users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllShipments = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) filter.status = status;

    const shipments = await Shipment.find(filter);
    res.json({ message: 'All shipments', shipments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.assignTransporter = async (req, res) => {
  try {
    const { shipmentId, transporterId } = req.body;

    const shipment = await Shipment.findOneAndUpdate(
      { id: shipmentId },
      { transporterId, status: 'picked_up', updatedAt: Date.now() },
      { new: true }
    );

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    res.json({ message: 'Transporter assigned', shipment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const pendingApprovals = await User.countDocuments({ status: 'pending_approval' });
    const activeUsers = await User.countDocuments({ status: 'active' });
    const totalShipments = await Shipment.countDocuments();
    const inTransitShipments = await Shipment.countDocuments({ status: 'in_transit' });
    const deliveredShipments = await Shipment.countDocuments({ status: 'delivered' });

    const stats = {
      users: { total: totalUsers, pending: pendingApprovals, active: activeUsers },
      shipments: { total: totalShipments, inTransit: inTransitShipments, delivered: deliveredShipments },
      portalDistribution: {
        admins: await User.countDocuments({ portalType: 'admin' }),
        customers: await User.countDocuments({ portalType: 'customer' }),
        transporters: await User.countDocuments({ portalType: 'transporter' })
      }
    };

    res.json({ message: 'Dashboard statistics', stats });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
