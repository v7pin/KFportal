const express = require('express');
const router = express.Router();

const claimsRoutes = require('./claims');
const certificatesRoutes = require('./certificates');
const donationsRoutes = require('./donations');

router.use('/claims', claimsRoutes);
router.use('/certificates', certificatesRoutes);
router.use('/donations', donationsRoutes);

module.exports = router;
