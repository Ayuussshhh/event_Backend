const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { generateTicket } = require('../utils/generateTicket');
const { sendEmail } = require('../utils/emailUtils');
const Event = require('../models/event');  // Assuming Event model exists
const User = require('../models/user');    // Assuming User model exists

// Create Stripe checkout session for event purchase
exports.createCheckoutSession = async (req, res) => {
  try {
    const { eventId, userId, quantity } = req.body;

    // Retrieve the event from the database
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).send({ error: 'Event not found' });
    }

    // Retrieve the user for email and confirmation purposes
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: event.name,
            },
            unit_amount: event.price * 100, // Price in paise
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.BASE_URL}/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
      metadata: {
        event_id: event.id,
        user_id: user.id,
        quantity: quantity,
      },
    });

    // Send response with session URL
    res.json({ url: session.url });

  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'An error occurred while creating checkout session' });
  }
};

// Handle successful payment
exports.paymentSuccess = async (req, res) => {
  try {
    const sessionId = req.query.session_id;

    // Retrieve session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const { metadata } = session;

    // Use the eventId and userId from the metadata
    const event = await Event.findByPk(metadata.event_id);
    const user = await User.findByPk(metadata.user_id);

    // Generate the ticket PDF
    const ticket = generateTicket(event, user);

    // Send a confirmation email to the user
    await sendEmail(user.email, 'Your Event Ticket', ticket);

    res.send('Payment successful. Ticket has been emailed to you!');
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'An error occurred while handling payment success' });
  }
};

// Handle canceled payment
exports.paymentCancel = (req, res) => {
  res.redirect('/');
};
