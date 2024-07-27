import express from "express";
import { createTask, deleteTask, getTask, updateTask, } from "../controllers/todo.js";
import { authenticatedUser } from "../middleware/auth.js";
const router = express.Router();
router.get("/", authenticatedUser, getTask);
router.post("/create", authenticatedUser, createTask);
router.put("/update/:id", authenticatedUser, updateTask);
router.delete("/delete/:id", authenticatedUser, deleteTask);
export default router;
