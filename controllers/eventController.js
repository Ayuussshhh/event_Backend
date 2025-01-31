const Event = require('../models/Event');

// Show the form to create a new event
exports.showCreateEventForm = (req, res) => {
    res.render('createEvent');  // Render the Hackathon event creation form
};

// Handle the form submission to create the Hackathon event
exports.createEvent = (req, res) => {
    const { name, theme, price, quantity, duration, prizes } = req.body;

    // Validate that all fields are filled
    if (!name || !theme || !price || !quantity || !duration || !prizes) {
        return res.status(400).send('All fields are required.');
    }

    // Create a new Hackathon event
    const newEvent = new Event({
        name: name,
        theme: theme,
        price: price,
        quantity: quantity,
        duration: duration,
        prizes: prizes
    });

    // Save the event to the database
    newEvent.save()
        .then(() => {
            res.redirect('/event/create');  // Redirect after event is created (or to a different page)
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error creating event');
        });
};

exports.createEvent = (req, res) => {
    console.log(req.body);  // Log the body to check if the form data is coming through correctly

    const { name, theme, price, quantity, duration, prizes } = req.body;

    // Create the new event
    const newEvent = new Event({
        name: name,
        theme: theme,
        price: price,
        quantity: quantity,
        duration: duration,
        prizes: prizes
    });

    newEvent.save()
        .then(() => {
            res.redirect('/event/create');
        })
        .catch(err => {
            res.status(500).send('Error creating event');
        });
};
