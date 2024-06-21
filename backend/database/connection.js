// connection.js
const sqlite3 = require('sqlite3').verbose();
let db;

const getSqliteDb = () => {
  if (!db) {
    db = new sqlite3.Database('./database.sqlite', (err) => {
      if (err) {
        console.error('Could not connect to database', err);
      } else {
        console.log('Connected to database');
      }
    });
  }
  return db;
};

module.exports = {
  getSqliteDb,
};
