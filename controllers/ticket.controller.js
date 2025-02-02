import { Ticket } from '../models/Ticket.js';
import { Event } from '../models/Event.js';
import { User } from '../models/User.js';

export const purchaseTicket = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user._id; // Get the user ID from the request

    // Find the event
    const event = await Event.findById(eventId);
    if (!event || event.availableTickets <= 0) {
      return res.status(400).json({ message: 'Event not found or sold out' });
    }

    // Deduct available tickets
    event.availableTickets -= 1;
    await event.save();

    // Create a new ticket
    const ticket = new Ticket({
      eventId,
      userId,
    });

    await ticket.save();

    // Return the ticket
    res.status(201).json(ticket);
  } catch (error) {
    console.log('Error in purchaseTicket controller:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getUserTickets = async (req, res) => {
  try {
    const userId = req.user._id; // Get the user ID from the request

    // Find all tickets for the user
    const tickets = await Ticket.find({ userId }).populate('eventId');
    res.status(200).json(tickets);
  } catch (error) {
    console.log('Error in getUserTickets controller:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
