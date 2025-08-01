import { catchAsyncErrors } from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "./errorMiddlewares.js";
import { User } from "../models/userModels.js";

export const isAuthenticated =catchAsyncErrors(async (req,res,next)=>{
    const {token}=req.cookies;
    if(!token)
        return next(new ErrorHandler("user not authenticated",401));
    const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);//to check if the token belongs to that user only
    console.log(decoded);
    req.user=await User.findById(decoded.id);
    next();
})

export const isAuthorized=(...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){//if logged in user is USER and not admin
            return next(new ErrorHandler(`user with this role (${req.user.role}) is not allowed to access`,400));
        }
        next();
    }
}