const express = require('express');
const router = express.Router();

const {
  resetParkingSlots,
  getAvailableParkingSlots,
} = require('../controllers/parking-slots');

router.get('/', getAvailableParkingSlots);
router.post('/', resetParkingSlots);

module.exports = router;
