import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			min: 0,
			required: true,
		},
		image: {
			type: String,
			required: [true, "Image is required"],
		},
		category: {
			type: String,
			required: true,
		},
		isFeatured: {
			type: Boolean,
			default: false,
		},
		date: {
			type: Date,
			required: true, // Add the date of the event
		},
		location: {
			type: String,
			required: true, // The location of the event
		},
	},
	{ timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
