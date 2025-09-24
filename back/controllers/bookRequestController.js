import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { BookRequest } from "../models/bookRequestModel.js";
import { Book } from "../models/bookModel.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";

export const requestBook = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;
  const user = req.user;

  const book = await Book.findById(bookId);
  if (!book) return next(new ErrorHandler("Book not found", 404));

  // Check if user already has a pending request
  const existingRequest = await BookRequest.findOne({
    "user.email": user.email,
    book: bookId,
    status: "pending"
  });

  if (existingRequest) {
    return next(new ErrorHandler("You already have a pending request for this book", 400));
  }

  await BookRequest.create({
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    },
    book: bookId
  });

  res.status(200).json({
    success: true,
    message: "Book request sent successfully"
  });
});

export const handleBookRequest = catchAsyncErrors(async (req, res, next) => {
  const { requestId } = req.params;
  const { status } = req.body;

  const request = await BookRequest.findById(requestId).populate("book");
  if (!request) return next(new ErrorHandler("Request not found", 404));

  const book = await Book.findById(request.book._id);
  if (!book) return next(new ErrorHandler("Book not found", 404));

  if (status === "approved" && book.quantity === 0) {
    return next(new ErrorHandler("Book is out of stock", 400));
  }

  request.status = status;
  await request.save();

  if (status === "approved") {
    book.quantity--;
    book.availibility = book.quantity > 0;
    await book.save();
  }

  if (status === "approved") {
    setTimeout(async () => {
      const borrowRecord = await Borrow.findOne({
        "user.email": request.user.email,
        book: book._id,
        createdAt: { $gt: request.updatedAt }
      });

      if (!borrowRecord) {
        book.quantity++;
        book.availibility = true;
        await book.save();
      }
    }, 2 * 24 * 60 * 60 * 1000); 
  }
  res.status(200).json({
    success: true,
    message: `Request ${status} successfully`
  });
});

export const getPendingRequests = catchAsyncErrors(async (req, res) => {
  const requests = await BookRequest.find({ 
    status: "pending",
    validTill: { $gt: new Date() }
  }).populate("book");

  res.status(200).json({
    success: true,
    requests
  });
});

// Add this new controller function
export const getMyRequests = catchAsyncErrors(async (req, res) => {
  const requests = await BookRequest.find({ 
    "user.email": req.user.email 
  }).populate("book");

  res.status(200).json({
    success: true,
    requests
  });
});