const Otp = require("../models/otp");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

// ======================== SEND OTP ========================
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // save OTP to DB
    await Otp.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true }
    );

    // send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS  // app password
      }
    });

    const mailOptions = {
      from: `"Expense Tracker" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your verification OTP code is ${otp}. It will expire in 5 minutes.`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ======================== VERIFY OTP AND REGISTER ========================
exports.verifyOtpAndRegister = async (req, res) => {
  try {
    const { fullName, email, password, profileImageUrl, otp } = req.body;

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) return res.status(400).json({ message: "OTP expired or not found" });
    if (otpRecord.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    // OTP correct → register user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      profileImageUrl
    });

    // cleanup OTP record
    await Otp.deleteOne({ email });

    // generate token (assuming JWT)
    const jwt = require("jsonwebtoken");
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.status(201).json({ token, user: newUser });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
