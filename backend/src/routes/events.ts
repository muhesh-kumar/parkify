import express from 'express';
const router = express.Router();

import { getEvents, createEvent } from '@controllers/events';
import eventValidations from '@validations/events';
import fileUpload from '@middlewares/file-upload';

router.get('/', getEvents);
router.post('/', fileUpload.single('image'), eventValidations, createEvent);

export default router;
