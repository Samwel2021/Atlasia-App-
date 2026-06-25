const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { verifyToken } = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// All chat routes require authentication
router.use(verifyToken);

// Get chat rooms for user
router.get('/rooms/:userId', chatController.getChatRooms);

// Create chat room
router.post('/rooms',
  body('userId1').notEmpty(),
  body('userId2').notEmpty(),
  body('roomType').isIn(['customer_admin', 'transporter_admin', 'admin_support']),
  handleValidationErrors,
  chatController.createChatRoom
);

// Get chat history
router.get('/:chatRoomId/history', chatController.getChatHistory);

// Send message
router.post('/message/send',
  body('chatRoomId').notEmpty(),
  body('messageText').notEmpty(),
  handleValidationErrors,
  chatController.sendMessage
);

// Mark message as read
router.put('/message/:messageId/read', chatController.markAsRead);

// Get admin channels (admin only)
router.get('/admin/channels/all', chatController.getAdminChatChannels);

module.exports = router;
