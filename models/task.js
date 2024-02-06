import mongoose from "mongoose"

const taskSchema = new mongoose.Schema({

    title: {
        type: String,
        unique: true
    },
    description: {
        type: String,
    },
    category: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
})

export const taskModel = new mongoose.model("Task", taskSchema)