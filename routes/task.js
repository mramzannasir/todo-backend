import express from "express"
import { categoriesTask, createTask, deleteTask, getAllTask, updateTask } from "../controllers/task.js"
import { isAuthenticated } from "../middlewares/auth.js"

const router = express.Router()

router.post("/create", isAuthenticated, createTask)
router.put("/update/:id", isAuthenticated, updateTask)
router.delete("/delete/:id", isAuthenticated, deleteTask)
router.get("/all", isAuthenticated, getAllTask)


export default router