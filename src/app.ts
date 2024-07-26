import express from "express";
import userRoutes from "./routes/user.js";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import dotenv from "dotenv";

dotenv.config();
export const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Backend start from here");
});
