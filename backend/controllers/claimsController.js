// claimsController.js
const { getSqliteDb } = require('../database/connection');
const db = getSqliteDb();

const getAllClaims = (req, res) => {
  const query = 'SELECT * FROM claims';
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
};

module.exports = {
  getAllClaims,
};
