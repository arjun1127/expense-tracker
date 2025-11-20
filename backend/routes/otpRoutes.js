const express = require("express");
const router = express.Router();
const otpController = require("../controllers/otpContrller");

router.post("/send-otp", otpController.sendOtp);
router.post("/verify-otp", otpController.verifyOtpAndRegister);

module.exports = router;
