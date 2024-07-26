import { userSchemaValidation, loginValidationSchema, } from "../validation/userValidation.js";
import User from "../models/user.js";
import { ZodError } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const signupUser = async (req, res) => {
    try {
        const validatedData = userSchemaValidation.parse(req.body);
        const existingUser = await User.findOne({ email: validatedData.email });
        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "User already exists with this email! Please login",
            });
            return;
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);
        validatedData.password = hashedPassword;
        const newUser = new User(validatedData);
        await newUser.save();
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: newUser,
        });
    }
    catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.errors,
            });
        }
        else {
            console.error("Error during signup:", error);
            res.status(500).json({
                success: false,
                message: "An error occurred while creating the user",
            });
        }
    }
};
export const loginUser = async (req, res) => {
    try {
        const validatedData = loginValidationSchema.parse(req.body);
        const user = await User.findOne({ email: validatedData.email });
        console.log(user);
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }
        const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }
        const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            success: true,
            message: "Login successful",
        });
    }
    catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.errors,
            });
        }
        else {
            console.error("Error during login:", error);
            res.status(500).json({
                success: false,
                message: "An error occurred while login",
            });
        }
    }
};
export const logoutUser = (req, res) => {
    try {
        res.cookie("authToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0,
        });
        res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    }
    catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while logging out",
        });
    }
};
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export const getUser = async () => {
    console.log("get user");
};
export const deleteUser = () => {
    console.log("delete user");
};
