import mongoose, { Schema } from "mongoose";
import { TodoTypes } from "../types/types.js";

export const todoSchema = new Schema({
  userId: {
    type: String,
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "todo",
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

const Todo = mongoose.model<TodoTypes>("Todo", todoSchema);
export default Todo;
