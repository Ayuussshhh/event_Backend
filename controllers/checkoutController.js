const Event = require('../models/Event'); // Assuming you have Event model

// Handle the checkout process
exports.checkout = (req, res) => {
    const { eventId, price, quantity } = req.body;

    // Find the event by ID (to make sure the details are correct)
    Event.findById(eventId)
        .then(event => {
            if (!event) {
                return res.status(404).send('Event not found');
            }

            // Process the booking - this is where you can handle payment logic (like Stripe)
            // For now, let's assume the payment is successful
            event.quantity -= quantity; // Reduce the quantity of tickets available

            // Update the event after booking
            event.save()
                .then(() => {
                    res.send(`Booking successful! You booked ${quantity} tickets for ${event.title}.`);
                })
                .catch(err => {
                    res.status(500).send('Error processing booking');
                });
        })
        .catch(err => {
            res.status(500).send('Error finding event');
        });
};
