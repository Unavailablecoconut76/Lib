import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { requestBook, handleBookRequest, getPendingRequests, getMyRequests } from "../controllers/bookRequestController.js";

const router = express.Router();

// Main route for fetching requests (handles both admin and user cases)
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    if (req.user.role === "Admin") {
      await getPendingRequests(req, res, next);
    } else {
      await getMyRequests(req, res, next);
    }
  } catch (error) {
    next(error);
  }
});

// Other routes
router.post("/request/:bookId", isAuthenticated, requestBook);
router.put("/:requestId", isAuthenticated, isAuthorized("Admin"), handleBookRequest);

export default router;