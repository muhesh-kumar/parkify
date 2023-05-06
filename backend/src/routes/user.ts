import express from 'express';
import { getUsers } from '@controllers/users';

const router = express.Router();

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Retrieve a list of events
 *     description: Retrieve a list of events from the remote Redis DB.
 */
router.get('/', getUsers);

export default router;
