// claims.js
const express = require('express');
const router = express.Router();
const { getAllClaims } = require('../controllers/claimsController');

router.get('/claims', getAllClaims);

module.exports = router;
