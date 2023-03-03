const { validationResult } = require('express-validator');
const HttpError = require('../utils/http-error');

// TODO: add the redis schema here
// const _Event = require('../models/event.model');

const getEvents = async (req, res, next) => {
  let events;

  try {
    // TODO: fetch all events from redis DB
    // events = await _Event.find();
  } catch (err) {
    const error = new HttpError('Unable to fetch the events', 500);
    return next(error);
  }

  if (!events || events.length === 0) {
    const error = new HttpError('Could not find any events', 404);
    return next(error);
  }

  res.json({ events: events });
};

const createEvent = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError('Invalid data provided', 422);
    return next(error);
  }

  // TODO: need to change
  // const { timestamp, description, level } = req.body;

  const objects = JSON.parse(req.body.objects);

  // TODO: create a new redis time series event
  // const createdEvent = new _Event({
  //   timestamp,
  //   description,
  //   level,
  //   objects,
  //   image: req.file.path
  // });

  try {
    // TODO: save the created event in redis DB
    // await createdEvent.save();
  } catch (err) {
    const error = new HttpError('Unable to create a new event', 500);
    return next(error);
  }

  res.status(201).json({ event: createdEvent.toObject() });
};

exports.getEvents = getEvents;
exports.createEvent = createEvent;
