import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { requestBook, handleBookRequest, getPendingRequests, getMyRequests } from "../controllers/bookRequestController.js";

const router = express.Router();

// router.get("/", isAuthenticated, async (req, res, next) => {
//   if (req.user.role === "Admin") {
//     return getPendingRequests(req, res, next);
//   }
//   return getMyRequests(req, res, next);
// });

router.get("/pending", isAuthenticated, isAuthorized("Admin"), getPendingRequests); // Admin route
router.get("/my-requests", isAuthenticated, getMyRequests);

router.post("/request/:bookId", isAuthenticated, requestBook);
router.put("/:requestId", isAuthenticated, isAuthorized("Admin"), handleBookRequest);
router.get("/my-requests", isAuthenticated, getMyRequests); // For users


export default router;