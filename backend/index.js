require('dotenv').config();

const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');

const HttpError = require('./utils/http-error');
const eventRoutes = require('./routes/events');

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

// add values to set
async function addToSet(slot) {
  try {
    const response = await redisClient.sAdd('availableSlots', [String(slot)]);
    console.log(response);
  } catch (err) {
    console.log('Error: ', err);
  }
}
// addToSet(1);
// for (let i = 1; i <= 162; i++) {
//   addToSet(i);
// }

// create a function to fetch values from a redis set with the name availableSlots
const getAvailableSlots = async () => {
  try {
    for await (const member of redisClient.sScanIterator('availableSlots')) {
      console.log(member);
    }
  } catch (err) {
    console.log(err);
  }
};
// getAvailableSlots();

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
