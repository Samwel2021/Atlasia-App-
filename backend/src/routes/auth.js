const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateEmail, validateOTP, validatePortalType, handleValidationErrors } = require('../middleware/validateInput');
const { verifyToken } = require('../middleware/authMiddleware');

// Request OTP
router.post('/request-otp',
  validateEmail,
  handleValidationErrors,
  authController.requestOTP
);

// Verify OTP
router.post('/verify-otp',
  validateEmail,
  validateOTP,
  validatePortalType,
  handleValidationErrors,
  authController.verifyOTP
);

// Protected routes
router.get('/profile', verifyToken, authController.getProfile);
router.put('/profile', verifyToken, authController.updateProfile);

module.exports = router;
