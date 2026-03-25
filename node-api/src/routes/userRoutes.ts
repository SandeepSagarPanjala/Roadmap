import express from "express";
import * as userController from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Map HTTP verbs and paths to their specific controller methods
// Now applying authenticateToken to restrict access
router.get("/", authenticateToken, userController.getAllUsers);
router.get("/:id", authenticateToken, userController.getUserById);
router.post("/add", userController.addUser);

export default router;
