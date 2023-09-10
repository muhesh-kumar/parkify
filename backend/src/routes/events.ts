import express from 'express';
const router = express.Router();

import {
  validateCreateEventRequestBody,
  getEvents,
  createEvent,
  deleteEvent,
} from '@controllers/events';

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Retrieve a list of events
 *     description: Retrieve a list of events from the remote Redis DB.
 */
router.get('/', getEvents);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     description: create a new event and store it in the Redis DB.
 */
router.post('/', validateCreateEventRequestBody, createEvent);

/**
 * @swagger
 * /api/events/{licensePlateNumber}:
 *   delete:
 *     summary: Delete an event with the given licensePlateNumber
 *     description: Given an object with the licensePlateNumber as one of its keys, find an event with that licensePlateNumber and delete it if exists in the DB
 */

// TODO: create a param middleware to validate licensePlateNumber
router.delete('/:licensePlateNumber', deleteEvent);

export default router;
