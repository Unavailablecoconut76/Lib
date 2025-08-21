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
    useTempfiles:true,
    tempFileDir:"/tmp/"
}))

app.use("/api/v1/auth",authRouter);
app.use("/api/v1/book",bookRouter);
app.use("/api/v1/borrow",borrowRouter);
app.use("/api/v1/user",userRouter);//u stupid piece of shit get OUT----nodemon wasnt being used until NOWWW??tf were u doin??

//http://localhost:4000/api/v1/auth/register
connectDB();

app.use(errorMiddleware);