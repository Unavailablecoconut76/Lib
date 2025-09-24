import { BookRequest } from '../models/bookRequestModel.js';
import { Book } from '../models/bookModel.js';

export const startRequestCleanup = async () => {
  try {
    const expiredRequests = await BookRequest.find({
      status: 'pending',
      validTill: { $lt: new Date() }
    });

    for (const request of expiredRequests) {
      request.status = 'rejected';
      await request.save();
    }
  } catch (error) {
    console.error('Error cleaning up expired requests:', error);
  }
};