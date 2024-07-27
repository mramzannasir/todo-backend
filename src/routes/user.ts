import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  loginUser,
  logoutUser,
  signupUser,
} from "../controllers/user.js";
import { adminOnly, authenticatedUser } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/all", adminOnly, getAllUsers);
router.get("/profile/:id", authenticatedUser, getUser);
router.delete("/delete/:id", adminOnly, deleteUser);

export default router;
