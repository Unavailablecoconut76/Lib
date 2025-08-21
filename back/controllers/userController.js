import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModels.js";
import bcrypt from "bcrypt";
import {v2 as cloudinary} from "cloudinary";


export const getAllUsers=catchAsyncErrors(async(req,res,next)=>{
    const users=await User.find({accountVerified:true});
    res.status(200).json({
        success:true,
        users,
    });
});
export const registerNewAdmin=catchAsyncErrors(async(req,res,next)=>{
    if(!req.files || Object.keys(req.files).length===0){
        return next(new ErrorHandler("Admin avatar is required",400));
    }
    const {name,email,password}=req.body;
    if(!name||!email||!password)
        return next(new ErrorHandler("please fill all fields",400));
    const isRegistered =await User.findOne({email,accountVerified:true});
    if(isRegistered)
        return next(new ErrorHandler("user already registered",400));

    const {avatar}=req.files;
    console.log(req.files);
    const allowedFormats=["image/png","image/jpeg","image/webp"];
    if(!allowedFormats.includes(avatar.mimetype)){
        return next(new ErrorHandler("File format not supported",400));
    }
    const hashedPassword=await bcrypt.hash(password,10);
    const cloudinaryResponse=await cloudinary.uploader.upload(
        avatar.tempFilePath,
        {
            folder:"lib_manage_avatar",
        }
    );
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error("Cloudinary err:",cloudinaryResponse.error||"error with cloudinary")
        return next(new ErrorHandler("filaed to upload avatar"),500);
    }
    const admin= await User.create({
        name,
        email,
        password:hashedPassword,
        role:"Admin",
        accountVerified:true,
        avatar:{
            public_id:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url
        }
    });
    res.status(201).json({
        sucess:true,
        message:"Admin registerred successfully",
        admin
    })
});

export const toggleBlacklistUser = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return next(new ErrorHandler("User not found", 404));
    user.blacklisted = !user.blacklisted;
    await user.save();
    res.status(200).json({
        success: true,
        message: `User ${user.blacklisted ? "blacklisted" : "un-blacklisted"} successfully`,
        user
    });
});