import express from 'express';
import { purchaseTicket, getUserTickets } from '../controllers/ticket.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Purchase a ticket
router.post('/purchase', protectRoute, purchaseTicket);

// Get user's tickets
router.get('/user/:userId', protectRoute, getUserTickets);

export default router;