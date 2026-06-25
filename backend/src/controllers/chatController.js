const { v4: uuidv4 } = require('uuid');
const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');
const User = require('../models/User');

exports.getChatRooms = async (req, res) => {
  try {
    const { userId } = req.params;
    const chatRooms = await ChatRoom.find({
      'participants.userId': userId
    });

    res.json({ message: 'Chat rooms', chatRooms });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createChatRoom = async (req, res) => {
  try {
    const { userId1, userId2, roomType } = req.body;

    const roomName = `${roomType}_${userId1}_${userId2}`;
    let chatRoom = await ChatRoom.findOne({ name: roomName });

    if (!chatRoom) {
      chatRoom = new ChatRoom({
        id: uuidv4(),
        name: roomName,
        roomType,
        participants: [
          { userId: userId1 },
          { userId: userId2 }
        ]
      });
      await chatRoom.save();
    }

    res.status(201).json({ message: 'Chat room created', chatRoom });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const { chatRoomId } = req.params;
    const { limit = 50, skip = 0 } = req.query;

    const messages = await Message.find({ chatRoomId })
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    res.json({ message: 'Chat history', messages: messages.reverse() });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { chatRoomId, messageText } = req.body;

    if (!messageText) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    const message = new Message({
      id: uuidv4(),
      chatRoomId,
      senderId: req.user.id,
      messageText,
      isRead: false
    });

    await message.save();
    res.status(201).json({ message: 'Message sent', data: message });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findOneAndUpdate(
      { id: messageId },
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Message marked as read', data: message });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAdminChatChannels = async (req, res) => {
  try {
    const customerChannel = await ChatRoom.findOne({ roomType: 'customer_admin' });
    const transporterChannel = await ChatRoom.findOne({ roomType: 'transporter_admin' });

    const channels = [
      {
        id: customerChannel?.id || uuidv4(),
        name: 'Customer Support',
        type: 'customer_admin',
        unreadCount: customerChannel ? 
          await Message.countDocuments({ chatRoomId: customerChannel.id, isRead: false }) : 0
      },
      {
        id: transporterChannel?.id || uuidv4(),
        name: 'Transporter Support',
        type: 'transporter_admin',
        unreadCount: transporterChannel ? 
          await Message.countDocuments({ chatRoomId: transporterChannel.id, isRead: false }) : 0
      }
    ];

    res.json({ message: 'Admin chat channels', channels });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
