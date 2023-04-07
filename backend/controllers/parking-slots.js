const redis = require('../lib/redis-client');
const { NUM_PARKING_SLOTS } = require('../constants');

const resetParkingSlots = async (req, res, next) => {
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

  res.status(201).json({ message: 'Parking Slots resetted successfully' });
};

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

exports.resetParkingSlots = resetParkingSlots;
exports.getAvailableParkingSlots = getAvailableParkingSlots;
