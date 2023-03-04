require('dotenv').config();

const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const redisClient = require('./redis-client');

// Connect to the Remote Redis DB
(async function () {
  await redisClient.connect();
})();

const HttpError = require('./utils/http-error');
const eventRoutes = require('./routes/events');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // origin: 'http://127.0.0.1:5173',
    origin: 'http://localhost:5173',
  },
});

app.use(bodyParser.json());
app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use('/api/events', eventRoutes);

app.use((req, res, next) => {
  const error = new HttpError('could not find this route.', 404);
  err.status = 404;
  next(err);
  throw error;
});

app.use((error, req, res, next) => {
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

// emit a socket event whenever there's a change in the redis DB

// Set up a Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle a change of data in Redis DB
  socket.on('redis-update', (data) => {
    console.log('Data: ' + data);

    // Broadcast the data to all connected clients
    io.emit('redis-update', data);
  });

  // Handle a disconnect event
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server started on port 3000');
});
