import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModels.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import {sendToken} from  "../utils/sendToken.js"
import { generateForgotPasswordEmailtemplate, generateVerificationOtpEmailtemplate } from "../utils/emailTemplate.js";
import { sendEmail } from "../utils/sendEmail.js";

export const register =catchAsyncErrors(async(req,res,next)=>{
    try{
        const{name,email,password}=req.body;
        if(!name||!email||!password)
            return next(new ErrorHandler("Please enter all fields",400));
        const isRegistered =await User.findOne({email,accountVerified:true});
        if(isRegistered)
            return next(new ErrorHandler("user already existing",400));
        const hashedPassword =await bcrypt.hash(String(password),10);
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
        })
        const verificationCode=await user.generateVerificationCode();
        await user.save();
        sendVerificationCode(verificationCode,email,res);
    }
    catch(error){
        next(error);
    }
});

export const verifyOTP=catchAsyncErrors(async(req,res,next)=>{
    const {email,otp}=req.body;
    if(!email||!otp)
            return next(new ErrorHandler("email or otp  is missing",400))
    try{
        const userAllEntries=await(User.find({
            email,
            accountVerified:false,
        })).sort({createdAt:-1});//take latest entry

        if(!userAllEntries){
            return next(new ErrorHandler("user not found",404));
        }

        let user;

        if(userAllEntries.length>1){
            user=userAllEntries[0];//latest entry 
            await User.deleteMany({
                _id:{$ne:user._id},//only one user unique _id exists..
                email,
                accountVerified:false,
            });
        }
        else{
            user=userAllEntries[0];
        }

        if(user.verificationCode!==Number(otp)){
            return next (new ErrorHandler("otp is invalid",400));
        }
        //otp matched...

        user.accountVerified=true;
        user.verificationCode=null;
        await user.save({validateModifiedOnly:true});


        sendToken(user,200,"Accountevrified",res);
    }catch(error){
        return next (new ErrorHandler("Internal server Error",500))
    }
})

export const login=catchAsyncErrors(async(req,res,next)=>{
    const {email,password} =req.body;
    if(!email||!password){
        return next(new ErrorHandler("pls enter all fields",400))
    }
    const user =await User.findOne({email,accountVerified:true}).select("+password");//explicitly tells Mongoose to include the password field in this specific query
    //The + prefix overrides the select: false setting just for this query
    if(!user){
        return next(new ErrorHandler("no such user.Invalid email or password",401))
    }
    const isPasswordMatched=await bcrypt.compare(password,user.password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Wrong details",401));
    }
    sendToken(user,200,"user login Complete!",res);
});

export const logout=catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("token","",{
        expires:new Date(Date.now()),
        httpOnly:true,
    }).json({
        success:true,
        messAGE:"LOGOUT complete",
    });
});

export const getUser =catchAsyncErrors(async(req,res,next)=>{
    const user= req.user;
    res.status(200).json({
        success:true,
        user
    })
});

export const forgotPassword =catchAsyncErrors(async(req,res,next)=>{
    if(!req.body.email)
        return next(new ErrorHandler("Email is required,400"));
    const user = await User.findOne({
        email:req.body.email,
        accountVerified:true,
    });
    if(!user)
        return next(new ErrorHandler("user not found.invalid email",400));
    const resetToken=user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});

    const resetPasswordUrl =`${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const message = generateForgotPasswordEmailtemplate(resetPasswordUrl);

    try{
        await sendEmail({
            email:user.email,
            subject:"Library Management System--recover passsword",
            message,
        });
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfuly`
        });
    }
    catch(error){
        user.resetPasswordToken=undefined;
        user.resetpasswordExpire=undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(error.message || "Cannot send email",500));
    }
})

export const resetpassword=catchAsyncErrors(async(req,res,next)=>{
    const {token}=req.params;
    const resetPasswordToken=crypto.createHash("sha256").update(token).digest("hex");

    const user =await User.findOne({
        resetPasswordToken,
        resetpasswordExpire:{$gt:Date.now()}
    });

    if(!user){
        return next(new ErrorHandler("rest password token is invalid or expired",400));
    }
    if(req.body.password!==req.body.confirmPassword)
        return next(new ErrorHandler("password and confirmed password do not match",400));
    
    const hashedPassword =await bcrypt.hash(req.body.password,10);
    user.password=hashedPassword;
    user.resetPasswordToken=undefined;
    user.resetpasswordExpire=undefined;

    await user.save();
    sendToken(user,200,"password sent successfully",res);
});

export const updatePassword=catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user._id).select("+password");
    const {currentPassword,newPassword,confirmNewPassword}=req.body;
    if(!currentPassword||!newPassword||!confirmNewPassword){
        return next (new ErrorHandler("Please fill all fields",400));
    }
    const isPasswordMatched=await bcrypt.compare(currentPassword,user.password);
    if(!isPasswordMatched)  
        return next(new ErrorHandler("current password is incorrect",400));

    if(newPassword!==confirmNewPassword){
        return next(new ErrorHandler("passwords do not match",400));
    }

    const hashedPassword=await bcrypt.hash(newPassword,10);
    user.password=hashedPassword;
    await user.save();
    res.status(200).json({
        success:true,
        message:"Password updated!"
    });
});//without forgetting password