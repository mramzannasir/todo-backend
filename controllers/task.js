import { taskModel } from "../models/task.js"

export const createTask = async (req, res) => {

    try {
        const user = req.user
        const { title, description, category } = req.body
        await taskModel.create({ title, description, category, user })
        res.status(201).json({
            success: true,
            message: "Task created successfully"
        })
    } catch (error) {
        if (error.code === 11000 && error.keyPattern.title === 1) {
            return res.status(400).json({
                success: false,
                message: "Task with this title already exists.",
            });
        }
        // hello
        console.log(error);
        res.status(500).json({
            success: false,
            message: "An error occurred to create task"
        })
    }
}
export const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const { title, description, category } = req.body


        const taskExist = await taskModel.findById(taskId)
        if (!taskExist) {
            res.status(404).json({
                success: false,
                message: "Task not found"
            })
        }

        const updateExistTask = await taskModel.findByIdAndUpdate(
            taskId,
            { title, description, category },
            { new: true, runValidators: true }
        )

        if (!updateExistTask) {
            res.status(404).json({
                success: false,
                message: "Task not found"
            })
        }



        res.status(200).json({
            success: true,
            message: "Task updated successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "An error occurred to update task"
        })
    }
}
export const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const taskExist = await taskModel.findById(taskId)
        if (!taskExist) {
            res.status(404).json({
                success: false,
                message: "Task not found"
            })
        }

        await taskModel.deleteOne({ _id: taskId });
        res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "An error occurred to delete task"
        })
    }
}
export const getAllTask = async (req, res) => {
    try {
        const user = req.user;
        const userId = user._id;
        const tasks = await taskModel.find({ user: userId });
        res.status(200).json({
            success: true,
            tasks,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "An error occurred to fetch all task"
        })
    }
}
export const categoriesTask = async (req, res) => {
    try {
        const category = req.params.category
        console.log(category);
        res.status(200).json({
            success: true,
            message: "This category task fetched"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "An error occurred to get this category task"
        })
    }
}