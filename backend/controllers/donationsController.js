const db = require('../database/connection').getMysqlDb();

const submitDonation = (req, res) => {
  const { name, email, city, amount } = req.body;
  const receipt = req.file;

  if (!name || !email || !city || !amount || !receipt) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = 'INSERT INTO donations (name, email, city, amount, receipt) VALUES (?, ?, ?, ?, ?)';
  const values = [name, email, city, amount, receipt.filename];

  if (!db) {
    return res.status(500).json({ error: 'Failed to connect to database' });
  }

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Failed to insert donation:', err);
      return res.status(500).json({ error: 'Failed to submit donation' });
    }
    res.status(200).json({ message: 'Donation received successfully' });
  });
};

const getDonations = (req, res) => {
  if (!db) {
    return res.status(500).json({ error: 'Failed to connect to database' });
  }

  db.query('SELECT * FROM donations', (err, results) => {
    if (err) {
      console.error('Failed to fetch donations:', err);
      return res.status(500).json({ error: 'Failed to fetch donations' });
    }
    res.json(results);
  });
};

module.exports = {
  submitDonation,
  getDonations
};
