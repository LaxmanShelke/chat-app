// require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const Message = require('./models/Message');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Hardcoded for test
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Database Connection
const mongoUri = "mongodb://localhost:27017/chat-app";
mongoose.connect(mongoUri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Socket.io Logic
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_room', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    socket.on('send_message', async (data) => {
        // data: { room, sender, content, timestamp }
        const { room, sender, content } = data;

        // Save to DB
        try {
            const newMessage = new Message({ room, sender, content });
            await newMessage.save();

            // Broadcast to room
            io.to(room).emit('receive_message', data);
        } catch (err) {
            console.error('Error saving message:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });
});

// Basic API Routes
app.get('/api/messages/:room', async (req, res) => {
    try {
        const messages = await Message.find({ room: req.params.room }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = 3002;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Server failed to start:', err);
});
