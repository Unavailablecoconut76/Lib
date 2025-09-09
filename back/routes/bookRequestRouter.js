import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { createBookRequest, handleBookRequest, getBookRequests } from "../controllers/bookRequestController.js";

const router = express.Router();

router.post("/request/:bookId", isAuthenticated, createBookRequest);
router.put("/:requestId", isAuthenticated, isAuthorized("Admin"), handleBookRequest);
router.get("/", isAuthenticated, getBookRequests);

export default router;