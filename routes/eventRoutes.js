const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Route to show the Hackathon creation form
router.get('/create', eventController.showCreateEventForm);

// Route to handle form submission to create the Hackathon event
router.post('/create', eventController.createEvent);

module.exports = router;
