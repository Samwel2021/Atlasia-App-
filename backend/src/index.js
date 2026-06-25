const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIO = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/cargo', require('./routes/cargo'));
app.use('/api/chat', require('./routes/chat'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Atlasia Backend is running' });
});

// Socket.io events
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  socket.on('join_chat', (data) => {
    socket.join(data.chatRoom);
    console.log(`User ${socket.id} joined chat room: ${data.chatRoom}`);
  });

  socket.on('send_message', (data) => {
    io.to(data.chatRoom).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Atlasia Backend Server running on port ${PORT}`);
});

module.exports = { app, server, io };
