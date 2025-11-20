const User = require("../models/User");
const jwt= require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1h"});
};

//register user 

exports.registerUser = async (req, res) => {
    const {fullName, email, password,profileImageUrl } = req.body;
    //validation check ofr missing fields
        if(!fullName?.trim() || !email?.trim() || !password?.trim()){
            return res.status(400).json({message: "Please provide all required fields"});
        }

    //check if user already exists
    try {
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }
        //create new user
        const newUser= await User.create({fullName, email, password, profileImageUrl});
        res.status(201).json({
            id: newUser._id,
            newUser,
            token: generateToken(newUser._id),
        });
    } catch (error) {
        res.status(500).json({message: "Server error",error: error.message});
    }

};

//login user
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

//get user data
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