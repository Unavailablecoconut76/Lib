import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { Book } from "../models/bookModel.js";
import {Borrow} from  "../models/borrowModel.js"
import { User } from "../models/userModels.js";
import { calculateFine } from "../utils/fineCalculator.js";

export const borrowedBook = catchAsyncErrors(async(req,res,next)=>{
    const {borrowedBooks} =req.user;
    res.status(200).json({
        success:true,
        borrowedBooks,
    });
});

export const recordBorrowedBook=catchAsyncErrors(async(req,res,next)=>{
    const {id}=req.params;
    const{email}=req.body;
    const book =await Book.findById(id);
    if(!book)
        return next(new ErrorHandler("book not found",400));

    const user= await User.findOne({email,role:"User"});//if admin cant borrow ,then, const user= await User.findOne({email,role:"User"})

    if(!user)
        return next(new ErrorHandler("user not founddd",400));

    if(book.quantity===0)
        return next(new ErrorHandler("no more books available"));

    const isAlreadyBorrowed=user.borrowedBooks.find(
       (b)=>b.bookId.toString()===id && b.returned===false
    );
    
    if(isAlreadyBorrowed)
        return next(new ErrorHandler("book alrready borrowed"));

    book.quantity--;
    book.availibility=book.quantity>0? true:false;
    await book.save();

    user.borrowedBooks.push({
        bookId:book._id,
        bookTitle:book.title,
        borrowedBook:new Date(),
        dueDate:new Date(Date.now()+ 7 * 24 * 60 * 60* 1000)
    });
    await user.save();
    await Borrow.create({
        user:{
            id:user._id,
            name:user.name,
            email:user.email
        },
        book:book._id,
        dueDate:new Date(Date.now()+7*24*60*60*1000),
    });

    res.status(200).json({
        success:true,
        message:"borrowed book recorded successfuly"
    });
});

export const getBorrowedBooksForAdmin=catchAsyncErrors(async(req,res,next)=>{
    const borrowedBooks =await Borrow.find();
    res.status(200).json({
        success:true,
        borrowedBooks,
    });
});

export const returnBorrowedBook =catchAsyncErrors(async(req,res,next)=>{
    const{bookId}=req.params;
    const {email}=req.body;
    const book =await Book.findById(bookId);
    if(!book)
        return next(new ErrorHandler("book not found",404));
    const user= await User.findOne({email,accountVerified:true});
    if(!user)
        return next(new ErrorHandler("user not found",404))
    const borrowedBook=user.borrowedBooks.find(
        (b)=>b.bookId.toString()===bookId && b.returned===false
    );
    if(!borrowedBook)
        return next(new ErrorHandler("you have not borrowed this book",400));
    borrowedBook.returned=true;
    await user.save();

    book.quantity++;
    book.availibility=book.quantity>0?true:false;
    await book.save();

    const borrow=await Borrow.findOne({
        book:bookId,
        "user.email":email,
        returnDate:null
    });
    if(!borrow)
        return next(new ErrorHandler("book not borrowed by you",400));
    borrow.returnDate=new Date();


    //fine calcualtion

    const fine =calculateFine(borrow.dueDate);
    borrow.fine=fine;
    await borrow.save();
    res.status(200).json({
        success:true,
        message:fine!=0?`The book has been returned successfully. The total Charges are${fine}`:`The book has been returned successfully.`
    });
});