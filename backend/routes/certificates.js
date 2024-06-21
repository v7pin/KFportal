const express = require('express');
const router = express.Router();
const certificatesController = require('../controllers/certificatesController');

router.post('/send', certificatesController.sendCertificate);
router.get('/sent', certificatesController.getAllSentCertificates);

module.exports = router;
