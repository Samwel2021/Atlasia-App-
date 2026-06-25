const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// All shipment routes require authentication
router.use(verifyToken);

// Create shipment (customers only)
router.post('/',
  verifyRole(['customer']),
  body('originLocation').notEmpty(),
  body('destinationLocation').notEmpty(),
  handleValidationErrors,
  shipmentController.createShipment
);

// Get shipment details
router.get('/:shipmentId', shipmentController.getShipment);

// Get tracking
router.get('/:shipmentId/tracking', shipmentController.getTracking);

// Update tracking (transporters only)
router.post('/:shipmentId/tracking',
  verifyRole(['transporter', 'admin']),
  body('latitude').isFloat(),
  body('longitude').isFloat(),
  handleValidationErrors,
  shipmentController.updateTracking
);

// Get customer shipments
router.get('/customer/list/all', shipmentController.getShipmentsByCustomer);

// Get transporter shipments
router.get('/transporter/list/all', shipmentController.getShipmentsByTransporter);

// Update shipment status (admin and transporter)
router.put('/:shipmentId/status',
  verifyRole(['admin', 'transporter']),
  body('status').isIn(['pending', 'picked_up', 'in_transit', 'delivered', 'cancelled']),
  handleValidationErrors,
  shipmentController.updateShipmentStatus
);

module.exports = router;
