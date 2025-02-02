import { Event } from '../models/Event.js'; // Adjust the import path as necessary

// Create a new event
export const createEvent = async (req, res) => {
  const { name, date, location, description, userId } = req.body;

  try {
    if (!name || !date || !location) {
      return res.status(400).json({ message: 'Please provide all event details.' });
    }

    const event = new Event({
      name,
      date,
      location,
      description,
      userId
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.log('Error in createEvent controller:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.log('Error in getEvents controller:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get event by ID
export const getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    console.log('Error in getEventById controller:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update an existing event (add this function if it's missing)
export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { name, date, location, description } = req.body;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Update event fields if provided
    if (name) event.name = name;
    if (date) event.date = date;
    if (location) event.location = location;
    if (description) event.description = description;

    // Save updated event
    await event.save();
    res.status(200).json(event);
  } catch (error) {
    console.log('Error in updateEvent controller:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete an event (optional)
export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.remove();
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.log('Error in deleteEvent controller:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
