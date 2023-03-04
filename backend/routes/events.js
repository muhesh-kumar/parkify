const express = require('express');
const router = express.Router();

const { getEvents, createEvent } = require('../controllers/events');
const eventValidations = require('../validations/events');
const fileUpload = require('../middlewares/file-upload');

router.get('/', getEvents);
// router.post('/', fileUpload.single('image'), eventValidations, createEvent);

module.exports = router;
