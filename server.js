import express from "express";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Setup dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== MongoDB Connection =====
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shanval_db";

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Exit if DB fails to connect
  });

// ===== Schema & Model =====
const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  submittedAt: { type: Date, default: Date.now }
});

const Message = mongoose.model("Message", messageSchema);

// ===== Nodemailer Config =====
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ===== Contact Form Endpoint =====
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    await transporter.sendMail({
      from: `"Shanval photography website" <${process.env.EMAIL_USER}>`,
      to: "johnmwaita2002@gmail.com",
      subject: `New Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`
    });

    res.status(200).send("Message sent successfully!");
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).send("Error sending message.");
  }
});

// ===== Serve Frontend =====
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Home.html"));
});

// ===== Start Server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
