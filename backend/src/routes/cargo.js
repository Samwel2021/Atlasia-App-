const express = require('express');
const router = express.Router();

// Create cargo shipment
router.post('/', (req, res) => {
  const { origin, destination, weight, description } = req.body;
  res.status(201).json({
    message: 'Cargo shipment created',
    shipment: { id: 1, origin, destination, weight, description, status: 'pending' }
  });
});

// Get cargo details
router.get('/:cargoId', (req, res) => {
  const { cargoId } = req.params;
  res.json({
    message: 'Cargo details',
    cargo: {
      id: cargoId,
      origin: 'Port A',
      destination: 'Port B',
      weight: '1000kg',
      status: 'in_transit',
      location: { lat: 0, lng: 0 },
      lastUpdate: new Date()
    }
  });
});

// Get live tracking
router.get('/:cargoId/tracking', (req, res) => {
  const { cargoId } = req.params;
  res.json({
    message: 'Live tracking data',
    tracking: [
      { timestamp: new Date(), lat: 0, lng: 0, status: 'picked_up' },
      { timestamp: new Date(), lat: 1, lng: 1, status: 'in_transit' }
    ]
  });
});

// Update cargo status
router.put('/:cargoId/status', (req, res) => {
  const { cargoId } = req.params;
  const { status } = req.body;
  res.json({ message: 'Cargo status updated', cargoId, status });
});

module.exports = router;
