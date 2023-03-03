// Require the necessary modules
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: '*' } });

const cors = require('cors');
app.use(cors());

// Set up a route for the homepage
app.get('/', (req, res) => {
  console.log('home endpoint');
});

// Set up a Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle a chat message event
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);

    // Broadcast the message to all connected clients
    io.emit('chat message', msg);
  });

  // Handle a disconnect event
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
http.listen(3000, () => {
  console.log('Server started on port 3000');
});
