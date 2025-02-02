import express from 'express';
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent } from '../controllers/event.controller.js';  // Adjust path as necessary

const router = express.Router();

// Create a new event
router.post('/', createEvent);

// Get all events (or filter by query parameters, like userId, date, etc.)
router.get('/', getEvents);

// Get event by ID
router.get('/:id', getEventById);

// Update an existing event
router.put('/:id', updateEvent);

// Delete an event
router.delete('/:id', deleteEvent);

export default router;
