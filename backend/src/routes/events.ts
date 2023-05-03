import express from 'express';
const router = express.Router();

import { getEvents, createEvent } from '@controllers/events';

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
router.post('/', createEvent);

export default router;
