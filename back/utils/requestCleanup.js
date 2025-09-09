import cron from 'node-cron';
import { BookRequest } from '../models/bookRequestModel.js';
import { Book } from '../models/bookModel.js';

export const startRequestCleanup = () => {
    cron.schedule('0 * * * *', async () => {
        try {
            const expiredRequests = await BookRequest.find({
                status: 'pending',
                validTill: { $lt: new Date() }
            });

            for (const request of expiredRequests) {
                request.status = 'rejected';
                await request.save();
            }

            console.log(`Cleaned up ${expiredRequests.length} expired requests`);
        } catch (error) {
            console.error('Request cleanup error:', error);
        }
    });
};