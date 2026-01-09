import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const mailOptions = {
  from: `"Test" <${process.env.EMAIL_USER}>`,
  to: process.env.EMAIL_USER,
  subject: "Test Email",
  text: "If you see this, your mail config works!"
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) return console.log("❌ Error:", error);
  console.log("✅ Email sent:", info.response);
});
