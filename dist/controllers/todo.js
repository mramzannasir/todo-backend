import Todo from "../models/todo.js";
import { userIdFinder } from "../utils/userIdFinder.js";
export const createTask = async (req, res) => {
    try {
        const taskData = req.body;
        const userId = userIdFinder(req);
        taskData.userId = userId;
        const existingTask = await Todo.findOne({ title: taskData.title });
        if (existingTask) {
            res.status(409).json({
                success: false,
                message: "Task with this title already exists!",
            });
            return;
        }
        await Todo.create(taskData);
        res.status(201).json({
            success: true,
            message: "Task created successfully",
        });
    }
    catch (error) {
        res.status(201).json({
            success: false,
            message: "Error occurred to create task",
        });
        console.log(error);
    }
};
export const getTask = async (req, res) => {
    try {
        const userId = userIdFinder(req);
        const tasks = await Todo.findOne({ userId: userId });
        if (!tasks) {
            res.status(200).json({
                success: true,
                message: "You do not have task",
                data: tasks,
            });
        }
        res.status(200).json({
            success: true,
            data: tasks,
        });
    }
    catch (error) {
        res.status(400).json({
            success: true,
            message: "Error occurred to get task",
        });
    }
};
export const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const updatedTask = await Todo.findOneAndUpdate({ _id: taskId }, req.body, {
            new: true,
        });
        if (!updatedTask) {
            res.status(404).json({
                success: false,
                message: "Task not found",
            });
            return;
        }
        res.status(202).json({
            success: true,
            message: "Task updated successfully",
            data: updatedTask,
        });
    }
    catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the task",
        });
    }
};
export const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const deletedTask = await Todo.findOneAndDelete({ _id: taskId });
        if (!deletedTask) {
            res.status(404).json({
                success: false,
                message: "Task not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the task",
        });
    }
};
