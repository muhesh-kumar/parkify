import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import bodyParser from 'body-parser';

import HttpError from './utils/http-error.js';
import eventRoutes from './routes/events.js';
import parkingSlotsRoutes from './routes/parking-slots.js';
import redis from './lib/redis-client.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // origin: 'http://127.0.0.1:5173',
    // origin: 'http://localhost:5173',
    origin: '*', // allow all origins
  },
});

app.use((req, res, next) => {
  req.io = io;
  return next();
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

// delete all the keys in a redis using ioredis package
const deleteAllKeys = async () => {
  try {
    const keys = await redis.keys('*');
    if (keys.length > 0) {
      await redis.del(keys);
    }
  } catch (error) {
    console.error('Error deleting keys:', error);
    throw new Error('Error deleting keys');
  }
};
// deleteAllKeys();

app.use('/api/events', eventRoutes);
app.use('/api/parking-slots', parkingSlotsRoutes);

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

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('redis-update', (data) => {
    io.emit('redis-update', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server started on port 3000');
});

// curl -X POST -F 'file=frame.jpg' -F "entryTimeStamp=19:07:23" http://localhost:3000/api/events
