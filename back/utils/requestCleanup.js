import cron from 'node-cron';
import { BookRequest } from '../models/bookRequestModel.js';
import { Book } from '../models/bookModel.js';

export const startRequestCleanup = () => {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    try {
      // Find expired approved requests
      const expiredRequests = await BookRequest.find({
        status: 'approved',
        validTill: { $lt: new Date() }
      });

      // Restore book quantities for expired requests
      for (const request of expiredRequests) {
        const book = await Book.findById(request.book);
        if (book) {
          book.quantity++;
          book.availibility = true;
          await book.save();
        }
        request.status = 'rejected';
        await request.save();
      }
    } catch (error) {
      console.error('Request cleanup error:', error);
    }
  });
};