require('dotenv').config();

const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const redisClient = require('./lib/redis-client');
const { validationResult } = require('express-validator');

// Connect to the Remote Redis DB
(async function () {
  await redisClient.connect();
  console.log('Connected to the Redis DB');
})();

const HttpError = require('./utils/http-error');
const eventRoutes = require('./routes/events');
const eventValidations = require('./validations/events');
const fileUpload = require('./middlewares/file-upload');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // origin: 'http://127.0.0.1:5173',
    // origin: 'http://localhost:5173',
    origin: '*', // allow all origins
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

const createEvent = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError('Invalid data provided', 422);
    return next(error);
  }

  const { entryTimeStamp } = req.body;
  const plateNumber = Math.floor(Math.random() * 1000000000).toString(36); // TODO: recieve it from the RPi itself

  // const plateNumber = 'ABC-123-WW-45'; // TODO: recieve it from the RPi itself
  const createdEvent = {
    entryTimeStamp,
    carImageLocation: '/upload/test.jpg',
    // carImageLocation: req.file.path,
  };

  try {
    const response = await redisClient.set(
      plateNumber,
      JSON.stringify(createdEvent)
    );
    console.log('when adding to the db: ', response);
    io.emit('redis-update', { plateNumber, ...createdEvent });
  } catch (err) {
    console.log(err);
    const error = new HttpError('Unable to create a new event', 500);
    return next(error);
  }

  res.status(201).json({ event: createdEvent });
};

app.use('/api/events', eventRoutes);
app.post(
  '/api/events',
  fileUpload.single('image'),
  eventValidations,
  createEvent
);

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

// a function to delete all keys in a redis DB
redisClient.flushAll();

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
