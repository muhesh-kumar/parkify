import express from 'express';
const router = express.Router();

import {
  resetParkingSlots,
  getAvailableParkingSlots,
  bookSlot,
} from '@controllers/parking-slots';

/**
 * @swagger
 * /api/parking-slots:
 *   get:
 *     summary: Retrieve all available parking slots
 *     description: Retrieve the IDs of all the available parking slots
 */
router.get('/', getAvailableParkingSlots);

/**
 * @swagger
 * /parking-slots:
 *   post:
 *     summary: Reset Parking Slots
 *     description: Removes all currently available parking slots and adds 162 new parking slots
 */
router.post('/', resetParkingSlots);

/**
 * @swagger
 * /api/parking-slots/{id}:
 *   patch:
 *     summary: Book the parking slot with given id
 *     description: Book the parking slot with given id if it's available
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the parking slot to book.
 *         schema:
 *           type: integer
 */
router.patch('/:id', bookSlot);

export default router;
