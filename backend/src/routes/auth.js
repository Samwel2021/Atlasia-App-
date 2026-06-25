const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

// In-memory storage (replace with database)
const users = new Map();
const otpStore = new Map();

// Email configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP Email
const sendOTPEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Atlasia Logistics - Email Verification',
      html: `<h2>Email Verification</h2><p>Your verification code is: <strong>${otp}</strong></p><p>This code expires in ${process.env.OTP_EXPIRY} minutes.</p>`
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};

// Request OTP
router.post('/request-otp',
  body('email').isEmail().normalizeEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email } = req.body;
      const otp = generateOTP();
      const expiryTime = Date.now() + parseInt(process.env.OTP_EXPIRY) * 60 * 1000;

      otpStore.set(email, { otp, expiryTime });

      const sent = await sendOTPEmail(email, otp);
      if (!sent) {
        return res.status(500).json({ message: 'Failed to send OTP email' });
      }

      res.json({ message: 'OTP sent to email', email });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Verify OTP and Register/Login
router.post('/verify-otp',
  body('email').isEmail().normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }),
  body('portalType').isIn(['admin', 'customer', 'transporter']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, otp, portalType } = req.body;
      const storedOTP = otpStore.get(email);

      if (!storedOTP) {
        return res.status(400).json({ message: 'OTP not found or expired' });
      }

      if (storedOTP.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }

      if (storedOTP.expiryTime < Date.now()) {
        otpStore.delete(email);
        return res.status(400).json({ message: 'OTP expired' });
      }

      // Create or update user
      let user = users.get(email);
      if (!user) {
        user = {
          id: uuidv4(),
          email,
          portalType,
          status: 'pending_approval',
          createdAt: new Date()
        };
        users.set(email, user);
      }

      otpStore.delete(email);

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, portalType: user.portalType },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY }
      );

      res.json({
        message: 'OTP verified. Awaiting admin approval.',
        user: { id: user.id, email: user.email, portalType: user.portalType, status: user.status },
        token
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

module.exports = router;
