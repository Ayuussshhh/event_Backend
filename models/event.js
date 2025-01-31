const mongoose = require('mongoose');

// Updated event schema for Hackathon
const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'Hackathon'  // default to Hackathon
    },
    theme: {
        type: String,
        required: true,
        default: 'Innovation' // default theme for Hackathon
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    duration: {  // Duration for Hackathon (e.g. 48 hours)
        type: String,
        required: true
    },
    prizes: {  // Prize for the winners
        type: String,
        required: true
    }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
