const express = require('express');
const router = express.Router();

// Get chat history
router.get('/:chatRoomId', (req, res) => {
  const { chatRoomId } = req.params;
  res.json({
    message: 'Chat history',
    messages: [
      { id: 1, sender: 'user1', message: 'Hello', timestamp: new Date() },
      { id: 2, sender: 'user2', message: 'Hi there', timestamp: new Date() }
    ]
  });
});

// Send message (handled via Socket.io in production)
router.post('/', (req, res) => {
  const { chatRoomId, message, senderId } = req.body;
  res.status(201).json({
    message: 'Message sent',
    data: { id: 1, chatRoomId, message, senderId, timestamp: new Date() }
  });
});

// Get chat rooms for user
router.get('/rooms/:userId', (req, res) => {
  const { userId } = req.params;
  res.json({
    message: 'Chat rooms',
    rooms: [
      { id: 1, name: 'Admin Support', type: 'admin', unreadCount: 2 }
    ]
  });
});

module.exports = router;
