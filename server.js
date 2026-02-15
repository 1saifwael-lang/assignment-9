const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/saraha")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
const bcrypt = require("bcryptjs");
const User = require("./models/User");

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // generate otp
    const otp = generateOTP();

    // save user
    const user = await User.create({
      email,
      password: hashedPassword,
      otp
    });

    // send email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`
    });

    res.json({ message: "OTP sent to your email" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const { encryptData, decryptData } = require("./utils/encryption");

app.get("/test-encryption", (req, res) => {

  const message = "Hello Saraha";

  const encrypted = encryptData(message);

  const decrypted = decryptData(encrypted);

  res.json({
    original: message,
    encrypted: encrypted.toString("base64"),
    decrypted: decrypted.toString()
  });

});
