import express from 'express';
const router = express.Router();

import {
  resetParkingSlots,
  getParkingSlots,
  bookParkingSlot,
  freeParkingSlot,
} from '@controllers/parking-slots';

/**
 * @swagger
 * /api/parking-slots:
 *   get:
 *     summary: Retrieve all available parking slots
 *     description: Retrieve the IDs of all the available parking slots
 */
router.get('/', getParkingSlots);

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
 *   delete:
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
router.delete('/:id', bookParkingSlot);

/**
 * @swagger
 * /api/parking-slots/{id}:
 *   post:
 *     summary: Free the parking slot with given id
 *     description: Free the parking slot with given id if it's available
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the parking slot to free.
 *         schema:
 *           type: integer
 */
router.post('/:id', freeParkingSlot);

export default router;
