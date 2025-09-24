import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { requestBook, handleBookRequest, getPendingRequests, getMyRequests } from "../controllers/bookRequestController.js";

const router = express.Router();

router.post("/request/:bookId", isAuthenticated, requestBook);
router.put("/:requestId", isAuthenticated, isAuthorized("Admin"), handleBookRequest);
router.get("/", isAuthenticated, async (req, res, next) => {
  if (req.user.role === "Admin") {
    return getPendingRequests(req, res, next);
  }
  return getMyRequests(req, res, next);
});

export default router;