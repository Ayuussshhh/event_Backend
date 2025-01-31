const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const stripe = require('stripe')(process.env.STRIPE_SECERT_KEY); // Ensure correct key is set
const dotenv = require('dotenv');
dotenv.config();  // Load environment variables

// Import routes
const authRoutes = require('./routes/authRoutes'); // Google Auth Routes
const checkoutRoutes = require('./routes/checkoutRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();
const PORT = process.env.PORT || 3000;  // Use environment variable if available, otherwise default to 3000

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Set up view engine
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));  // For form submissions (application/x-www-form-urlencoded)
app.use(bodyParser.json());

app.use(session({
    secret: 'my-very-secret-key-12345!',  // Use a secret string
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// Initialize Passport and session
require('./config/passport');  // Ensure passport is configured

// Google Auth Routes
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

// Use session and initialize passport
app.use('/auth', authRoutes);

// Root Route
app.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

// User Dashboard Route
app.get('/user/dashboard', (req, res) => {
  if (!req.user) {
    return res.redirect('/');  // If no user, redirect to home page
  }
  res.render('dashboard', { user: req.user });
});

// Route to Log the User Out
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

// Select Event Route (for displaying event details)
app.get('/select-event', (req, res) => {
  const event = {
    name: 'Hackathon',
    price: 500,
    quantity: 1
  };
  res.render('selectEvent', { event });
});

app.post('/checkout', async (req, res) => {
  try {
    // Create a Checkout Session from the line items
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: req.body.eventName || 'Hackathon'  // Dynamic product name
            },
            unit_amount: req.body.price * 100, // Amount in cents (500 INR = 500 * 100)
          },
          quantity: 1,
        }
      ],
      mode: 'payment',
      success_url: `${process.env.BASE_URL}/complete?session_id={CHECKOUT_SESSION_ID}`, // Use session ID in success URL
      cancel_url: `${process.env.BASE_URL}/cancel`,
    });

    res.json({ url: session.url });  // Send the session URL to frontend
  } catch (err) {
    console.error('Error creating Stripe session:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/complete', async (req, res) => {
  const sessionId = req.query.session_id;
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status === 'paid') {
    res.send('Payment complete. Thank you for your purchase!');
  } else {
    res.send('Payment failed. Please try again.');
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
