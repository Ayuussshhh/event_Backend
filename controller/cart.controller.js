import Event from "../models/event.model.js";

export const getCartEvents = async (req, res) => {
  try {
    const events = await Event.find({ _id: { $in: req.user.cartItems.map(item => item.eventId) } });

    // Add quantity for each event based on user's registration
    const cartItems = events.map((event) => {
      const item = req.user.cartItems.find((cartItem) => cartItem.eventId.toString() === event._id.toString());
      return { ...event.toJSON(), quantity: item.quantity };
    });

    res.json(cartItems);
  } catch (error) {
    console.log("Error in getCartEvents controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addToCart = async (req, res) => {
	try {
	  const { eventId } = req.body;  // We're assuming the event is being added to the cart
	  const user = req.user;
  
	  // Check if the user is already registered for this event
	  const existingItem = user.cartItems.find((item) => item.eventId.toString() === eventId);
  
	  if (existingItem) {
		existingItem.quantity += 1;  // If already registered, just increase the ticket quantity
	  } else {
		user.cartItems.push({ eventId, quantity: 1 });  // Add the event with one ticket
	  }
  
	  await user.save();
	  res.json(user.cartItems);  // Return updated cart items
	} catch (error) {
	  console.log("Error in addToCart controller", error.message);
	  res.status(500).json({ message: "Server error", error: error.message });
	}
  };

  export const removeAllFromCart = async (req, res) => {
	try {
	  const { eventId } = req.body;
	  const user = req.user;
  
	  // If no eventId is passed, clear all events from the cart
	  if (!eventId) {
		user.cartItems = [];
	  } else {
		user.cartItems = user.cartItems.filter((item) => item.eventId.toString() !== eventId);
	  }
  
	  await user.save();
	  res.json(user.cartItems);  // Return updated cart
	} catch (error) {
	  console.log("Error in removeAllFromCart controller", error.message);
	  res.status(500).json({ message: "Server error", error: error.message });
	}
  };
  
  export const updateQuantity = async (req, res) => {
	try {
	  const { eventId } = req.params;  // Event ID from URL parameters
	  const { quantity } = req.body;   // New ticket quantity
	  const user = req.user;
  
	  // Find the event in the user's cart
	  const existingItem = user.cartItems.find((item) => item.eventId.toString() === eventId);
  
	  if (existingItem) {
		if (quantity === 0) {
		  // If quantity is 0, remove the event from the cart
		  user.cartItems = user.cartItems.filter((item) => item.eventId.toString() !== eventId);
		  await user.save();
		  return res.json(user.cartItems);
		}
  
		// Update the ticket quantity
		existingItem.quantity = quantity;
		await user.save();
		res.json(user.cartItems);  // Return updated cart
	  } else {
		res.status(404).json({ message: "Event not found in cart" });
	  }
	} catch (error) {
	  console.log("Error in updateQuantity controller", error.message);
	  res.status(500).json({ message: "Server error", error: error.message });
	}
  };
  