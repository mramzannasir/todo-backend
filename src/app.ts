import express, { NextFunction } from "express";
import userRoutes from "./routes/user.js";
import todoRoutes from "./routes/todo.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
export const app = express();

app.use(
  cors({
    origin: "http://your-frontend-domain.com",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/todo", todoRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Todo API! ^^");
});
