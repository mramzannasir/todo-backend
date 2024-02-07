import express from "express"
import { getProfile, login, logout, register, updateProfile } from "../controllers/user.js"
import { isAuthenticated } from "../middlewares/auth.js"

const router = express.Router()


router.post("/register", register)
router.post("/login", login)
router.get("/logout", logout)
router.get('/profile', isAuthenticated, getProfile)
router.put('/updateProfile', isAuthenticated, updateProfile)

export default router