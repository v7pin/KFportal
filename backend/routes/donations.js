const express = require('express');
const multer = require('multer');
const path = require('path');
const donationsController = require('../controllers/donationsController');

const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/donation-form', upload.single('receipt'), donationsController.submitDonation);
router.get('/donations', donationsController.getDonations);

module.exports = router;
