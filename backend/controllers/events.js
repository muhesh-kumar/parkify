const { validationResult } = require('express-validator');

const redisClient = require('../lib/redis-client');
const HttpError = require('../utils/http-error');
const redis = require('../lib/redis-client');

const getEvents = async (req, res, next) => {
  let events = {};

  try {
    // get all the keys and its corresponding value from a redis DB with error handling
    const keys = await redis.keys('*');
    const values = await Promise.all(
      keys.map(async (key) => {
        if (key !== 'availableSeats') {
          return redis.get(key);
        } else {
          return redis.smembers(key);
        }
      })
    );
    events = keys.reduce((acc, key, index) => {
      if (key !== 'availableSeats') {
        acc[key] = JSON.parse(values[index]);
      } else {
        acc[key] = values[index];
      }
      return acc;
    }, {});
  } catch (err) {
    console.log(err);
    const error = new HttpError('Unable to fetch the events', 500);
    return next(error);
  }

  if (Object.keys(events).length === 0) {
    const error = new HttpError('Could not find any events', 404);
    return next(error);
  }

  res.json({ events: events });
};

// const createEvent = async (req, res, next) => {
//   const io = req.io;
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     const error = new HttpError('Invalid data provided', 422);
//     return next(error);
//   }

//   const { entryTimeStamp } = req.body;
//   // TODO: recieve it from the RPi itself
//   const plateNumber = Math.floor(Math.random() * 1000000000).toString(36);

//   // const plateNumber = 'ABC-123-WW-45'; // TODO: recieve it from the RPi itself
//   const createdEvent = {
//     entryTimeStamp,
//     carImageLocation: '/upload/test.jpg',
//     // carImageLocation: req.file.path,
//   };

//   // Add the event as a key value pair
//   try {
//     const response = await redisClient.set(
//       plateNumber,
//       JSON.stringify(createdEvent)
//     );
//     console.log('when adding to the db: ', response);
//     io.emit('redis-update', { plateNumber, ...createdEvent });
//   } catch (err) {
//     console.log(err);
//     const error = new HttpError('Unable to create a new event', 500);
//     return next(error);
//   }

//   res.status(201).json({ event: createdEvent });
// };

const createEvent = async (req, res, next) => {
  const io = req.io;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError('Invalid data provided', 422);
    return next(error);
  }

  const { entryTimeStamp } = req.body;
  // TODO: receive it from the RPi itself
  const plateNumber = Math.floor(Math.random() * 1000000000).toString(36);

  // const plateNumber = 'ABC-123-WW-45'; // TODO: receive it from the RPi itself
  const createdEvent = {
    entryTimeStamp,
    carImageLocation: '/upload/test.jpg',
    // carImageLocation: req.file.path,
  };

  // Add the event as a key value pair
  try {
    const response = await redis.set(plateNumber, JSON.stringify(createdEvent));
    console.log('when adding to the db: ', response);
    io.emit('redis-update', { plateNumber, ...createdEvent });
  } catch (err) {
    console.log(err);
    const error = new HttpError('Unable to create a new event', 500);
    return next(error);
  }

  res.status(201).json({ event: createdEvent });
};

exports.getEvents = getEvents;
exports.createEvent = createEvent;
