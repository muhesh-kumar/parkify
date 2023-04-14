import express from 'express';
const router = express.Router();

import {
  resetParkingSlots,
  getAvailableParkingSlots,
  bookSlot,
} from '../controllers/parking-slots.js';

router.get('/', getAvailableParkingSlots);
router.post('/', resetParkingSlots);
router.patch('/:id', bookSlot);

export default router;
