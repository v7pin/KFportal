const { createCanvas, loadImage } = require("canvas");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const db = require('../database/connection').db();

const sendCertificate = async (req, res) => {
  const { id, certificateType } = req.body;
  try {
    const claim = await db.get("SELECT * FROM claims WHERE id = ?", id);
    if (!claim) {
      return res.status(404).json({ error: "Claim not found" });
    }

    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext("2d");

    const templatePath = path.join(__dirname, '../', claim.gender === "Male" ? `certificate_male.jpg` : `certificate_female.jpg`);
    const template = await loadImage(templatePath);

    ctx.drawImage(template, 0, 0, 800, 600);
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(claim.name, 200, 300);
    ctx.fillText(claim.claimed_at, 200, 350);

    const certificatesDir = path.join(__dirname, '../certificates');
    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir);
    }

    const certificatePath = path.join(certificatesDir, `${id}_${certificateType}.png`);
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(certificatePath, buffer);

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
      subject: `Your ${certificateType}`,
      text: `Please find your ${certificateType} attached.`,
      attachments: [
        {
          filename: `${certificateType}.png`,
          path: certificatePath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    const sentAt = new Date().toISOString();
    await db.run("UPDATE claims SET sent = 1 WHERE id = ?", id);
    await db.run(
      "INSERT INTO sent_certificates (name, email, gender, batchName, certificateType, sent_at) VALUES (?, ?, ?, ?, ?, ?)",
      claim.name, claim.email, claim.gender, claim.batchName, certificateType, sentAt
    );

    res.json({ message: "Certificate sent successfully!" });
  } catch (error) {
    console.error("Error sending certificate:", error);
    res.status(500).json({ error: "Failed to send certificate" });
  }
};

const getAllSentCertificates = async (req, res) => {
  try {
    const sentCertificates = await db.all("SELECT * FROM sent_certificates");
    res.json(sentCertificates);
  } catch (error) {
    console.error("Error fetching sent certificates:", error);
    res.status(500).json({ error: "Failed to fetch sent certificates" });
  }
};

module.exports = {
  sendCertificate,
  getAllSentCertificates
};
