import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

export const signup = async(req,res)=>{
    const {fullName,email,password}=req.body;
    try {

        if(!fullName || !email || !password){
            return res.status(400).json({message:"All fields are required"})
        }

        if(password.length<6){
            return res.status(400).json({message:"Password Must be at least 6 characters"})
        }

        const user = await User.findOne({email})

        if (user) return res.status(400).json({message:"Email already exists"});

        const salt = await bcrypt.genSalt(10)
        const hasedPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            fullName,
            email,
            password:hasedPassword,
        })

        if(newUser){

            generateToken(newUser._id,res)
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic,
            })

        }
        else{
            res.status(400).json({message:"Invalid User Data"})
        }
    } 
    catch (error) {
        console.log("error in signup controller", error.message)
        res.status(500).json({message:"Internal server Error"});
    }
}
export const login = async (req,res)=>{
    // res.send("login route")
    try {
        
        const{email,password} = req.body;
    
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"Invalid credentials"})
        }
    
        const isPasswordcorrect = await bcrypt.compare(password,user.password)
        if(!isPasswordcorrect){
            return res.status(404).json({ message: "Invalid credentials" })
        }
    
        generateToken(user._id,res)
    
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })
    } catch (error) {
        console.log("error in login controller", error.message)
        return res.status(500).json({ message: "internal server error" })
    }

}
export const logout = async(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out successfully"})

    } catch (error) {
        console.log("error in logout controller", error.message)
        return res.status(500).json({ message: "internal server error" })
    }
}
export const updateProfile=async(req,res)=>{
    
    try {
        const{profilePic}= req.body;
        const userId= req.user._id;

        if(!profilePic){
            return res.status(404).json({message:"Profile Pic is required"})
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updateUser= await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
        res.status(200).json(updateUser)

    } catch (error) {
        console.log("Error in Updateprofile",error.message)
        return res.status(501).json({message:"internal server error"})
    }
}
export const checkAuth = async(req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("error in checkAuth controller", error.message)
        res.status(500).json({message:"Internal server error"})
    }
}