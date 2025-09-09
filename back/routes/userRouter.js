import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { 
    getAllUsers, 
    registerNewAdmin, 
    toggleBlacklistUser, 
    deleteAccount,
    bulkImportBooks 
} from "../controllers/userController.js";

const router = express.Router();

router.get("/all", isAuthenticated, isAuthorized("Admin"), getAllUsers);
router.post("/add/new-admin", isAuthenticated, isAuthorized("Admin"), registerNewAdmin);
router.put("/toggle-blacklist/:id", isAuthenticated, isAuthorized("Admin"), toggleBlacklistUser);
router.delete("/delete-account", isAuthenticated, deleteAccount);
router.post("/bulk-import", isAuthenticated, isAuthorized("Admin"), bulkImportBooks);

export default router;