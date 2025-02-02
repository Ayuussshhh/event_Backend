import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Event from "../models/event.model.js";

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({});  // Fetch all events
    res.json({ events });
  } catch (error) {
    console.log("Error in getAllEvents controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getFeaturedEvents = async (req, res) => {
	try {
	  let featuredEvents = await redis.get("featured_events");
	  if (featuredEvents) {
		return res.json(JSON.parse(featuredEvents));  // Return cached data
	  }
  
	  // If not in cache, fetch from MongoDB
	  featuredEvents = await Event.find({ isFeatured: true }).lean();
  
	  if (!featuredEvents) {
		return res.status(404).json({ message: "No featured events found" });
	  }
  
	  // Store featured events in Redis for future use
	  await redis.set("featured_events", JSON.stringify(featuredEvents));
  
	  res.json(featuredEvents);
	} catch (error) {
	  console.log("Error in getFeaturedEvents controller", error.message);
	  res.status(500).json({ message: "Server error", error: error.message });
	}
  };

export const createEvent = async (req, res) => {
  try {
    const { name, description, price, image, category, date } = req.body;

    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "events" });
    }

    const event = await Event.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
      category,
      date,
    });

    res.status(201).json(event);
  } catch (error) {
    console.log("Error in createEvent controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
	try {
	  const event = await Event.findById(req.params.id);
  
	  if (!event) {
		return res.status(404).json({ message: "Event not found" });
	  }
  
	  // If event has an image, delete it from Cloudinary
	  if (event.image) {
		const publicId = event.image.split("/").pop().split(".")[0];
		try {
		  await cloudinary.uploader.destroy(`events/${publicId}`);
		  console.log("Deleted image from Cloudinary");
		} catch (error) {
		  console.log("Error deleting image from Cloudinary", error);
		}
	  }
  
	  await Event.findByIdAndDelete(req.params.id);
	  res.json({ message: "Event deleted successfully" });
	} catch (error) {
	  console.log("Error in deleteEvent controller", error.message);
	  res.status(500).json({ message: "Server error", error: error.message });
	}
  };
  
  export const getRecommendedEvents = async (req, res) => {
	try {
	  const events = await Event.aggregate([
		{
		  $sample: { size: 4 },  // Randomly select 4 events
		},
		{
		  $project: {
			_id: 1,
			name: 1,
			description: 1,
			image: 1,
			price: 1,
		  },
		},
	  ]);
  
	  res.json(events);
	} catch (error) {
	  console.log("Error in getRecommendedEvents controller", error.message);
	  res.status(500).json({ message: "Server error", error: error.message });
	}
  };
  

  export const getEventsByCategory = async (req, res) => {
	const { category } = req.params;
	try {
	  const events = await Event.find({ category });
	  res.json({ events });
	} catch (error) {
	  console.log("Error in getEventsByCategory controller", error.message);
	  res.status(500).json({ message: "Server error", error: error.message });
	}
  };
  
  export const toggleFeaturedEvent = async (req, res) => {
	try {
	  const event = await Event.findById(req.params.id);
	  if (event) {
		event.isFeatured = !event.isFeatured;  // Toggle the featured status
		const updatedEvent = await event.save();
		await updateFeaturedEventsCache();  // Update the cache
		res.json(updatedEvent);
	  } else {
		res.status(404).json({ message: "Event not found" });
	  }
	} catch (error) {
	  console.log("Error in toggleFeaturedEvent controller", error.message);
	  res.status(500).json({ message: "Server error", error: error.message });
	}
  };
  
  async function updateFeaturedEventsCache() {
	try {
	  const featuredEvents = await Event.find({ isFeatured: true }).lean();
	  await redis.set("featured_events", JSON.stringify(featuredEvents));  // Update the cache
	} catch (error) {
	  console.log("Error in updating cache for featured events", error.message);
	}
  }
  