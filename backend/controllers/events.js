const { validationResult } = require('express-validator');

const redisClient = require('../lib/redis-client');
const HttpError = require('../utils/http-error');

const getEvents = async (req, res, next) => {
  let events = {};

  try {
    // get all the keys and its corresponding value from a redis DB with error handling
    const keys = await redisClient.keys('*');
    const values = await Promise.all(keys.map((key) => redisClient.get(key)));
    events = keys.reduce((acc, key, index) => {
      acc[key] = JSON.parse(values[index]);
      return acc;
    }, {});
    console.log(events);
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
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     const error = new HttpError('Invalid data provided', 422);
//     return next(error);
//   }

//   const { entryTimeStamp } = req.body;
//   const plateNumber = Math.floor(Math.random() * 1000000000).toString(36); // TODO: recieve it from the RPi itself

//   // const plateNumber = 'ABC-123-WW-45'; // TODO: recieve it from the RPi itself
//   const createdEvent = {
//     entryTimeStamp,
//     createImageLocation: '/upload/test.jpg',
//     // carImageLocation: req.file.path,
//   };

//   try {
//     const response = await redisClient.set(
//       plateNumber,
//       JSON.stringify(createdEvent)
//     );
//     console.log('when adding to the db: ', response);
//   } catch (err) {
//     console.log(err);
//     const error = new HttpError('Unable to create a new event', 500);
//     return next(error);
//   }

//   res.status(201).json({ event: createdEvent });
// };

exports.getEvents = getEvents;
// exports.createEvent = createEvent;
