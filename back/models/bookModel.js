import mongoose from "mongoose";

const bookSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    author:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
    },
    fine:{
        type:Number,
    },
    quantity:{
        type:Number,
        required:true
    },
    availibility:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true
});

export const Book=mongoose.model("Book",bookSchema);

//additional copies required are 05
//max intake for each book or something is 180.