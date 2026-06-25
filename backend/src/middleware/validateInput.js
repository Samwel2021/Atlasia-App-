const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation error',
      errors: errors.array() 
    });
  }
  next();
};

const validateEmail = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Valid email is required');

const validateOTP = body('otp')
  .isLength({ min: 6, max: 6 })
  .withMessage('OTP must be 6 digits');

const validatePortalType = body('portalType')
  .isIn(['admin', 'customer', 'transporter'])
  .withMessage('Invalid portal type');

module.exports = {
  handleValidationErrors,
  validateEmail,
  validateOTP,
  validatePortalType
};
