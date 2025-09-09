import express from "express";
import {config} from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middlewares/errorMiddlewares.js"; 
import authRouter from "./routes/authRouter.js";
import bookRouter from "./routes/bookRouter.js";
import borrowRouter from "./routes/borrowRouter.js";
import expressFileupload from "express-fileupload";
import userRouter from "./routes/userRouter.js";
import bookRequestRouter from "./routes/bookRequestRouter.js"; // Import the bookRequestRouter
import { startRequestCleanup } from './utils/requestCleanup.js';

config({path:"./config/config.env"})//load env file for port deifination

export const app=express();

app.use(cors({
    origin:process.env.FRONTEND_URL,
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}));

app.use(cookieParser());
app.use(express.json());//middlewares
app.use(express.urlencoded({extended:true}));

app.use(expressFileupload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}))

app.use("/api/v1/auth",authRouter);
app.use("/api/v1/book",bookRouter);
app.use("/api/v1/borrow",borrowRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/book-requests", bookRequestRouter); // Add this line

//http://localhost:4000/api/v1/auth/register
connectDB();
startRequestCleanup(); // Add this line

app.use(errorMiddleware);