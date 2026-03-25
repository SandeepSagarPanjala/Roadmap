import express from "express";
// Import all the controller actions
import * as userController from "../controllers/userController.js";

const router = express.Router();

// Map HTTP verbs and paths to their specific controller methods
// Notice how clean this is! No logic here, just routing.
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/add", userController.addUser);

export default router;
