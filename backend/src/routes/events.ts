import express from 'express';
const router = express.Router();

import { getEvents, createEvent } from '@controllers/events';

router.get('/', getEvents);
router.post('/', createEvent);

export default router;
