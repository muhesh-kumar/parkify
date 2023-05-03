import express from 'express';
const router = express.Router();

import { deleteKeys } from '@controllers/redis-keys';

/**
 * @swagger
 * /api/redis-keys:
 *   delete:
 *     summary: Delete all keys from the Redis DB
 *     description: Delete both events and availableParkingSlots from the redis DB
 */
router.delete('/', deleteKeys);

export default router;
