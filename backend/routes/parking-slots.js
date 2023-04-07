const express = require('express');
const router = express.Router();

const {
  resetParkingSlots,
  getAvailableParkingSlots,
  bookSlot,
} = require('../controllers/parking-slots');

router.get('/', getAvailableParkingSlots);
router.post('/', resetParkingSlots);
router.patch('/:id', bookSlot);

module.exports = router;
