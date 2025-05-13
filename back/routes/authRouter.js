import express from "express";
import { register,verifyOTP,login,logout, getUser, forgotPassword, resetpassword, updatePassword } from "../controllers/authControllers.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";


const router=express.Router();
router.post("/register",register);
router.post("/verify-otp",verifyOTP);
router.post("/login",login);
router.get("/logout",isAuthenticated,logout);//no data changes so get
router.get("/me",isAuthenticated,getUser);
router.post("/password/forgot",forgotPassword);
router.put("/password/reset/:token",resetpassword)
router.put("/password/update",isAuthenticated,updatePassword)
export default router;
