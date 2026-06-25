const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// All admin routes require authentication and admin role
router.use(verifyToken, verifyRole(['admin']));

// Approval management
router.get('/approvals/pending', adminController.getPendingApprovals);
router.put('/approvals/:userId', adminController.approveUser);

// User management
router.get('/users', adminController.getAllUsers);

// Shipment management
router.get('/shipments', adminController.getAllShipments);
router.put('/shipments/:shipmentId/assign-transporter', adminController.assignTransporter);

// Dashboard
router.get('/dashboard/stats', adminController.getDashboardStats);

module.exports = router;
