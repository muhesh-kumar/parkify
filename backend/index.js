require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const { createClient } = require('redis');
const { promisify } = require('util');

const redisClient = createClient({
  password: 'hrjvcSFOKrqNvnHUXwthokI9SF6l5Rtp',
  socket: {
    host: 'redis-17510.c301.ap-south-1-1.ec2.cloud.redislabs.com',
    port: 17510,
  },
});

async function connectRedisClient() {
  await redisClient.connect();
}
connectRedisClient();

// add a sample json to a redis DB with error handling
async function addJsonToRedis(key, json) {
  try {
    const response = await redisClient.set(key, JSON.stringify(json));
    console.log(response);
  } catch (err) {
    console.log(err);
  }
}

const carData = {
  carImageLocation: '/images/cars/ABC123.png',
  entryTimeStamp: '2022-02-28T10:00:00Z',
};

// addJsonToRedis('ABC123', carData);

// delete a key from a redis DB with error handling
async function deleteKeyFromRedis(key) {
  try {
    const response = await redisClient.del(key);
    console.log(response);
  } catch (err) {
    console.log(err);
  }
}
// deleteKeyFromRedis('car_entry_data');

// get all the keys and its corresponding value from a redis DB with error handling
async function getAllKeysFromRedis() {
  try {
    const keys = await redisClient.keys('*');
    const values = await Promise.all(keys.map((key) => redisClient.get(key)));
    const result = keys.reduce((acc, key, index) => {
      acc[key] = JSON.parse(values[index]);
      return acc;
    }, {});
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}
// getAllKeysFromRedis();

const HttpError = require('./utils/http-error');

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

// app.use('/api/events', eventRoutes);

app.use((req, res, next) => {
  const error = new HttpError('could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
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
server.listen(3000, () => {
  console.log('Server started on port 3000');
});
