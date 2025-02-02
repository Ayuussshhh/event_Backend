import Event from "../models/event.model.js"; // Import Event model
import Ticket from "../models/ticket.model.js"; // Import Ticket model
import { stripe } from "../lib/stripe.js"; // Import Stripe

export const createCheckoutSession = async (req, res) => {
  try {
    const { tickets } = req.body;

    // Check if tickets array is valid
    if (!Array.isArray(tickets) || tickets.length === 0) {
      return res.status(400).json({ error: "Invalid or empty tickets array" });
    }

    let totalAmount = 0;
    const lineItems = [];

    // Validate and prepare line items for Stripe checkout
    for (const ticket of tickets) {
      const event = await Event.findById(ticket.eventId);
      if (!event) {
        return res.status(400).json({ error: `Event not found for ticket ID: ${ticket.eventId}` });
      }

      const ticketPrice = event.price; // Get price from the event
      totalAmount += ticketPrice * ticket.quantity;

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: event.name, // Name of the event
            images: [event.image], // Image of the event
          },
          unit_amount: Math.round(ticketPrice * 100), // Stripe expects price in cents
        },
        quantity: ticket.quantity,
      });

      // Ensure the event has enough tickets available
      if (event.availableTickets < ticket.quantity) {
        return res.status(400).json({ error: "Not enough tickets available" });
      }
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      metadata: {
        userId: req.user._id.toString(),
        tickets: JSON.stringify(
          tickets.map((t) => ({
            eventId: t.eventId,
            quantity: t.quantity,
            price: t.price,
          }))
        ),
      },
    });

    // Respond with session details
    res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
  } catch (error) {
    console.error("Error processing checkout:", error);
    res.status(500).json({ message: "Error processing checkout", error: error.message });
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // Parse the ticket details from the session metadata
      const tickets = JSON.parse(session.metadata.tickets);

      // Create a new ticket order for the user
      const newTicketOrder = await Ticket.create({
        user: session.metadata.userId,
        tickets: tickets.map((ticket) => ({
          event: ticket.eventId,
          quantity: ticket.quantity,
          price: ticket.price,
        })),
        totalAmount: session.amount_total / 100, // Convert from cents to dollars
        stripeSessionId: sessionId,
      });

      // Update the event's available tickets and sold tickets
      for (const ticket of tickets) {
        const event = await Event.findById(ticket.eventId);
        if (event) {
          event.availableTickets -= ticket.quantity;
          event.soldTickets += ticket.quantity;
          await event.save();
        }
      }

      res.status(200).json({
        success: true,
        message: "Payment successful, order created.",
        orderId: newTicketOrder._id,
      });
    } else {
      res.status(400).json({ message: "Payment failed or was not completed." });
    }
  } catch (error) {
    console.error("Error processing successful checkout:", error);
    res.status(500).json({ message: "Error processing successful checkout", error: error.message });
  }
};
