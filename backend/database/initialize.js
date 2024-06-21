const { initializeSqlite, initializeMysql } = require('./connection');

const initializeDatabase = async () => {
  try {
    const sqliteDb = await initializeSqlite();
    console.log('SQLite Database initialized');

    const mysqlDb = initializeMysql();
    console.log('MySQL Database initialized');

    await sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS claims (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        gender TEXT,
        batchName TEXT,
        certificateWanted TEXT,
        claimed_at TEXT,
        sent INTEGER DEFAULT 0
      );
    `);

    await sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS sent_certificates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        gender TEXT,
        batchName TEXT,
        certificateType TEXT,
        sent_at TEXT
      );
    `);

    const existingClaims = await sqliteDb.all("SELECT * FROM claims");
    if (existingClaims.length === 0) {
      await sqliteDb.run(`
        INSERT INTO claims (name, email, gender, batchName, certificateWanted, claimed_at)
        VALUES 
          ('John Doe', 'john@example.com', 'Male', 'Batch A', 'OFFER Letter, Certificate of Recommendation', '2023-05-01'),
          ('Jane Smith', 'jane@example.com', 'Female', 'Batch B', 'Certificate of Appreciation, Certificate of Completion', '2023-05-02'),
          ('Alice Johnson', 'alice@example.com', 'Female', 'Batch C', 'Certificate of Recommendation, Certificate of Completion', '2023-05-03'),
          ('Bob Brown', 'bob@example.com', 'Male', 'Batch D', 'OFFER Letter', '2023-05-04'),
          ('Emily White', 'emily@example.com', 'Female', 'Batch E', 'Certificate of Completion', '2023-05-05');
      `);
    }

  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

module.exports = initializeDatabase;
