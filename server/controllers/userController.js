import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "cloudinary";


// Signup a new user

export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    try {
        if(!fullName || !email || !password) {
            return res.status(400).json({ success:false, message: "All fields are required" });
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ success:false, message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            bio
        });

        const token = generateToken(newUser._id);

        res.status(201).json({ success:true,userData: newUser, message: "User created successfully", token });

    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).json({ success:false, message: "Server Error" });
    }
}

// Controller for user login

export const login = async (req, res) => { 
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ success:false, message: "All fields are required" });
        }
        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(400).json({ success:false, message: "Invalid credentials" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, userData.password) 

        if (!isPasswordCorrect) {
            return res.status(400).json({ success:false, message: "Invalid credentials" });
        }

        const token = generateToken(userData._id);

        res.status(200).json({ success:true,userData, message: "Login successful", token });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ success:false, message: "Server Error" });
    }
}

// Controller to check if user is authenticated

export const checkAuth = (req, res) => {
    res.status(200).json({ success:true, user: req.user });
}

// Controller to update user profile
export const updateProfile = async (req, res) => {
    try {
        const { fullName, bio, profilePic } = req.body;
        const userId = req.user._id;
        let updatedUser;

        if (!profilePic) { 
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { fullName, bio },
                { new: true, runValidators: true }
            );
        } else {
            const upload = await cloudinary.uploader.upload(profilePic)
            updatedUser = await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url, fullName, bio},{new:true,runValidators:true});
        }

        res.status(200).json({ success: true, user: updatedUser, message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error in updateProfile:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}