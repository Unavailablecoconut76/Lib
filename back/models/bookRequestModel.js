import mongoose from "mongoose";

const bookRequestSchema = new mongoose.Schema({
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String, 
      required: true,
    },
    role:{
      type:String,
      enum:["Admin","User"],//role can beonly these
      default:"User",
    }
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  validTill: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days from now
    }
  }
},{timestamps:true});

export const BookRequest = mongoose.model("BookRequest", bookRequestSchema);