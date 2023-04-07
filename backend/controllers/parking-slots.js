const redis = require('../lib/redis-client');
const { NUM_PARKING_SLOTS } = require('../../common/constants');

const getAvailableParkingSlots = async (req, res, next) => {
  let availableParkingSlots = [];
  try {
    const values = await redis.smembers('availableSlots');
    availableParkingSlots = values;
    console.log(availableParkingSlots);
  } catch (error) {
    console.error('Error fetching set values:', error);
    throw new Error('Error fetching set values');
  }
  res.json({ availableParkingSlots });
};

const resetParkingSlots = async (req, res, next) => {
  const io = req.io;

  const addValueToSet = async (setName, value) => {
    try {
      const result = await redis.sadd(setName, value);
      console.log(`${result} value added to set ${setName}`);
      return result;
    } catch (err) {
      console.error(`Error adding values to set ${setName}: `, err);
      throw err;
    }
  };
  for (let i = 1; i <= NUM_PARKING_SLOTS; i++) {
    addValueToSet('availableSlots', i);
  }

  io.emit('redis-update', { message: 'Available Slots resetted' });

  res.status(201).json({ message: 'Parking Slots resetted successfully' });
};

const bookSlot = async (req, res, next) => {
  const io = req.io;
  const { id } = req.params;
  console.log('Id to be removed', id);

  try {
    const result = await redis.srem('availableSlots', id);
    if (result === 1) {
      res.status(200).json({ message: 'ID removed from set' });
      io.emit('redis-update', {
        message: 'AvailableSlots changed after booking',
      });
    } else {
      res.status(404).json({ message: 'ID not found in set' });
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError('Unable to remove ID from set', 500);
    return next(error);
  }
};

exports.resetParkingSlots = resetParkingSlots;
exports.getAvailableParkingSlots = getAvailableParkingSlots;
exports.bookSlot = bookSlot;
