const { validationResult } = require('express-validator');

const HttpError = require('../utils/http-error');
const redis = require('../lib/redis-client');

const getEvents = async (req, res, next) => {
  let events = {};

  try {
    // get all the keys and its corresponding value from a redis DB with error handling
    let cursor = '0';
    do {
      const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', '*');
      cursor = nextCursor;

      for (const key of keys) {
        const keyType = await redis.type(key);
        let value;

        switch (keyType) {
          case 'string':
            value = await redis.get(key);
            events[key] = JSON.parse(value);
            break;
          // case 'hash':
          //   value = await redis.hgetall(key);
          //   events[key] = {};
          //   for (const prop in value) {
          //     events[key][prop] = JSON.parse(value[prop]);
          //   }
          //   break;
          // case 'list':
          //   value = await redis.lrange(key, 0, -1);
          //   events[key] = value.map(JSON.parse);
          //   break;
          // case 'set':
          //   value = await redis.smembers(key);
          //   events[key] = value;
          //   break;
          // case 'zset':
          //   value = await redis.zrange(key, 0, -1, 'WITHSCORES');
          //   events[key] = {};
          //   for (let i = 0; i < value.length; i += 2) {
          //     events[key][value[i]] = JSON.parse(value[i + 1]);
          //   }
          //   break;
          default:
            console.log(`Unknown key type: ${keyType}`);
            break;
        }
      }
    } while (cursor !== '0');

    console.log('events: ', events);
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

  const nextAvailableParkingSlot = await getNextAvailableParkingSlot();
  console.log('next available slot: ', nextAvailableParkingSlot);
  const createdEvent = {
    entryTimeStamp,
    carImageLocation: '/upload/test.jpg',
    nextAvailableParkingSlot,
    // carImageLocation: req.file.path,
  };

  try {
    // add the event
    const response = await redis.set(plateNumber, JSON.stringify(createdEvent));
    console.log('when adding the event to the db: ', response);

    // book the slot
    const result = await redis.srem('availableSlots', nextAvailableParkingSlot);
    console.log('when booking a slot: ', response);

    io.emit('redis-update', { plateNumber, ...createdEvent });
  } catch (err) {
    console.log(err);
    const error = new HttpError('Unable to create a new event', 500);
    return next(error);
  }

  res.status(201).json({ event: createdEvent });
};

const getNextAvailableParkingSlot = async () => {
  const members = await redis.smembers('availableSlots');
  return members.length > 0 ? members[0] : null;
};

exports.getEvents = getEvents;
exports.createEvent = createEvent;
