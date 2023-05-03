import express from 'express';
const router = express.Router();

import { deleteKeys } from '@controllers/redis-keys';

router.delete('/', deleteKeys);

export default router;
