import { config } from "dotenv";
import express from "express";
import userRouter from "./routes/user.js";
import taskRouter from "./routes/task.js";
import cookieParser from "cookie-parser";
import cors from 'cors';

export const app = express()

config()



app.use(express.json());
app.use(cookieParser())

app.use(
    cors({
        origin: [process.env.FRONTEND_URL],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.get("/", (req, res) => {
    res.send("Welcome to the Nasir Dev API integration"); // You can customize this message
});
app.use("/v1/user", userRouter)
app.use("/v1/task", taskRouter)