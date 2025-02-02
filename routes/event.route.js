import express from "express";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getFeaturedEvents,
  getEventsByCategory,
  getRecommendedEvents,
  toggleFeaturedEvent,
} from "../controllers/event.controller.js"; // Change controller to handle events and tickets
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public Routes
router.get("/", getAllEvents); // Get all events
router.get("/featured", getFeaturedEvents); // Get featured events
router.get("/category/:category", getEventsByCategory); // Get events by category
router.get("/recommendations", getRecommendedEvents); // Get recommended events

// Admin Routes (Require Authentication and Admin Role)
router.post("/", protectRoute, adminRoute, createEvent); // Create an event
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedEvent); // Toggle featured status of an event
router.delete("/:id", protectRoute, adminRoute, deleteEvent); // Delete an event

export default router;
