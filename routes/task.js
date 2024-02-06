import express from "express"
import { createTask, deleteTask, getAllTask, updateTask } from "../controllers/task.js"
import { isAuthenticated } from "../middlewares/auth.js"

const router = express.Router()

router.post("/create", isAuthenticated, createTask)
router.put("/update/:id", updateTask)
router.delete("/delete/:id", deleteTask)
router.get("/all", getAllTask)

export default router