import { Request, Response } from "express";
import {
  userSchemaValidation,
  loginValidationSchema,
} from "../validation/userValidation.js";
import User from "../models/user.js";
import { ZodError } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const signupUser = async (
  req: Request,
  res: Response
): Promise<void> => {
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
    const hashedPassword = await bcrypt.hash(
      validatedData.password,
      saltRounds
    );
    validatedData.password = hashedPassword;
    const newUser = await User.create(validatedData);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      });
    } else {
      console.error("Error during signup:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while creating the user",
      });
    }
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = loginValidationSchema.parse(req.body);
    const user = await User.findOne({ email: validatedData.email });
    console.log(user);
    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not found please signup",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.password
    );
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "30d" }
    );
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
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      });
    } else {
      console.error("Error during login:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while login",
      });
    }
  }
};

export const logoutUser = (req: Request, res: Response): void => {
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
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while logging out",
    });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      res.status(400).json({
        success: false,
        message: "User not exist please login",
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Some thing went wrong to find user",
    });
    console.log(
      "Some thing went wrong to find user please try late again",
      error
    );
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
      return;
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error during deleting user:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the user",
    });
  }
};
