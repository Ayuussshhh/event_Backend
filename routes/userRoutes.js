// routes/eventRoutes.js
const express = require('express');
const router = express.Router();

// Define your route here
router.get('/', (req, res) => {
  res.send('Admin List');
});

// Export the router correctly
module.exports = router;
