import mongoose from "mongoose";

export const connectDB=async()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName:"sqlproj"
    }).then(()=>{
        console.log(`dtatbase connected..`)
    }).catch(err=>{
        console.log(`error conecting to database`,err)
    });
};