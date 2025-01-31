const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

// Handle the checkout POST request
router.post('/checkout', checkoutController.checkout);

module.exports = router;
