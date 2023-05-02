import express from 'express';
const router = express.Router();

import { deleteAllKeys } from '@controllers/redis-keys';

router.delete('/', deleteAllKeys);

export default router;
