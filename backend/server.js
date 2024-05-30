const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const nodemailer = require("nodemailer");
const { createCanvas, loadImage } = require("canvas");
const path = require("path");
const fs = require("fs");
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

let db;
async function initializeDatabase() {
  db = await open({
    filename: './certificates.db',
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS claims (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      claimed_at TEXT,
      sent INTEGER DEFAULT 0
    );
  `);

  const existingClaims = await db.all("SELECT * FROM claims");
  if (existingClaims.length === 0) {
    await db.run(`
      INSERT INTO claims (name, email, claimed_at)
      VALUES ('John Doe', 'vipin333kvk@gmail.com', '2023-05-01'),
            ('Jane Smith', 'vipin333kvk@gmail.com', '2023-05-02'),
            ('Vipin Kumar', 'vipin333kvk@gmail.com', '2023-05-02');
    `);
  }
}

initializeDatabase().catch((error) => {
  console.error("Error initializing database:", error);
});

app.get("/api/claims", async (req, res) => {
  try {
    const claims = await db.all("SELECT * FROM claims WHERE sent = 0");
    res.json(claims);
  } catch (error) {
    console.error("Error fetching claims:", error);
    res.status(500).json({ error: "Failed to fetch claims" });
  }
});

app.post("/api/send-certificate", async (req, res) => {
  const { id, name, dateOfJoining } = req.body;

  try {
    const claim = await db.get("SELECT * FROM claims WHERE id = ?", id);
    if (!claim) {
      return res.status(404).json({ error: "Claim not found" });
    }

    // Create certificate image using canvas
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext("2d");

    // Load certificate template
    const templatePath = path.join(__dirname, "certificate.jpg");
    const template = await loadImage(templatePath);

    ctx.drawImage(template, 0, 0, 800, 600);

    // Add text to the certificate
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(name, 200, 300);
    ctx.fillText(dateOfJoining, 200, 350);

    // Ensure the certificates directory exists
    const certificatesDir = path.join(__dirname, "certificates");
    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir);
    }

    // Save the certificate as a PNG file
    const certificatePath = path.join(certificatesDir, `${id}.png`);
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(certificatePath, buffer);

    // Send email with certificate
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: claim.email,
      subject: "Your Certificate",
      text: "Please find your certificate attached.",
      attachments: [
        {
          filename: "certificate.png",
          path: certificatePath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    // Mark claim as sent
    await db.run("UPDATE claims SET sent = 1 WHERE id = ?", id);

    res.json({ message: "Certificate sent successfully!" });
  } catch (error) {
    console.error("Error sending certificate:", error);
    res.status(500).json({ error: "Failed to send certificate" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
