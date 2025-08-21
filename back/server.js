import {app} from "./app.js";
import {v2 as cloudinary} from "cloudinary";
import fileUpload from "express-fileupload";

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLIENT_NAME,
    api_key:process.env.CLOUDINARY_CLIENT_API,
    api_secret:process.env.CLOUDINARY_CLIENT_SECRET
})

app.use(fileUpload({ useTempFiles: true }));

app.listen(process.env.PORT,()=>{
    console.log(`serve is running!--in port:${process.env.PORT}`)
});