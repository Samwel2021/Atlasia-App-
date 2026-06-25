const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const otpStore = new Map();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Atlasia Logistics - Email Verification Code',
      html: `
        <h2>Welcome to Atlasia Logistics</h2>
        <p>Your email verification code is:</p>
        <h1 style="color: #007bff; letter-spacing: 2px;">${otp}</h1>
        <p>This code expires in ${process.env.OTP_EXPIRY} minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      `
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};

exports.requestOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

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
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, portalType } = req.body;

    if (!email || !otp || !portalType) {
      return res.status(400).json({ message: 'Email, OTP, and portal type are required' });
    }

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

    // Find or create user
    let user = await User.findOne({ email, portalType });
    
    if (!user) {
      const userId = uuidv4();
      user = new User({
        id: userId,
        email,
        portalType,
        status: 'pending_approval'
      });
      await user.save();
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
      user: {
        id: user.id,
        email: user.email,
        portalType: user.portalType,
        status: user.status
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User profile', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone, address, city, country, companyName } = req.body;
    
    const user = await User.findOneAndUpdate(
      { id: req.user.id },
      {
        fullName,
        phone,
        profile: { companyName, address, city, country },
        updatedAt: Date.now()
      },
      { new: true }
    );

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
