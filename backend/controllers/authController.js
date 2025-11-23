const User = require("../models/User");
const jwt= require("jsonwebtoken");
const sendEmail=require("../utils/sendEmail");

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1h"});
};

//register user 

exports.registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body;

    if (!fullName?.trim() || !email?.trim() || !password?.trim()) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }

    try {
        let user = await User.findOne({ email });

        // 🔹 If user exists AND is verified → block
        if (user && user.isVerified) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Generate OTP & expiry
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = Date.now() + 5 * 60 * 1000;

        // 🔹 If user exists but NOT verified → update fields
        if (user && !user.isVerified) {
            user.fullName = fullName;
            user.password = password; // hashed in model pre-save
            user.profileImageUrl = profileImageUrl || user.profileImageUrl;
            user.otp = otp;
            user.otpExpiry = otpExpiry;

            await user.save();

            await sendEmail(
                email,
                "Verify your email",
                `Your OTP is ${otp}. It expires in 5 minutes.`
            );

            return res.json({
                message: "OTP resent. Please verify your email.",
                email: user.email
            });
        }

        // 🔹 User does NOT exist → create fresh user
        const newUser = await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
            otp,
            otpExpiry,
            isVerified: false
        });

        await sendEmail(
            email,
            "Verify your email",
            `Your OTP is ${otp}. It expires in 5 minutes.`
        );

        return res.status(201).json({
            message: "OTP sent to email.",
            email: newUser.email
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
        return res.status(400).json({ message: "User already verified" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({
        message: "Email verified successfully",
        token: generateToken(user._id),
        user
    });
};



exports.loginUser = async (req, res) => {
    const {email,password}=req.body;
    if(!email||!password){
        return res.status(400).json({message:"all feilds are required"})
    }
    try{
        const existingUser=await User.findOne({email});
        if(!existingUser || !(await existingUser.comparePassword(password))){
            return res.status(400).json({message:"Invalid credentials"});
        }
        res.status(200).json({
            id: existingUser._id,
            fullName: existingUser.fullName,
            existingUser,
            token: generateToken(existingUser._id),
        });
    }catch(error){
        res.status(500).json({message:"Server error", error: error.message});
    }
};

exports.getUserData = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({message: "Server error", error: error.message});
    }                                                                                                                                                                                                                                              
}; 


exports.resendOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified" });
        }

        // OPTIONAL: Prevent OTP spam (allow only every 30 seconds)
        if (user.otpExpiry && user.otpExpiry - Date.now() > 4 * 60 * 1000) {
            // Means the previous OTP was just generated
            return res.status(429).json({
                message: "Please wait before requesting a new OTP"
            });
        }

        // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = Date.now() + 5 * 60 * 1000;

        // Update user OTP fields
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Send OTP email again
        await sendEmail(
            email,
            "Your new OTP",
            `Your new OTP is ${otp}. It expires in 5 minutes.`
        );

        res.status(200).json({ message: "OTP resent successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
