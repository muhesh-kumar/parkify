import express from 'express';
const router = express.Router();

import { getEvents, createEvent } from '../controllers/events.js';
import eventValidations from '../validations/events.js';
import fileUpload from '../middlewares/file-upload.js';

router.get('/', getEvents);
router.post('/', fileUpload.single('image'), eventValidations, createEvent);

export default router;
