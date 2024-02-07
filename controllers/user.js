import { userModel } from "../models/user.js"
import bcrypt from "bcrypt"
import { setCookie } from "../utils/setCookie.js"

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const userExist = await userModel.findOne({ email })
        if (userExist) {
            return res.status(404).json({
                success: false,
                message: "User Already Registered Please Login"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await userModel.create({ name, email, password: hashedPassword })
        setCookie(user, res, "User created Successfully", 201)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "An error occurred to create user please late again"
        })
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const userExist = await userModel.findOne({ email })
        if (!userExist) {
            return res.status(404).json({
                success: false,
                message: "User not exist please signup first"
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, userExist.password)
        if (!isPasswordMatch) {
            return res.status(404).json({
                success: false,
                message: "Password not matched"
            })
        }
        setCookie(userExist, res, `welcome back dear ${userExist.name}`, 200)
    } catch (error) {
        console.log(error);
        res.status(404).json({
            success: false,
            message: "An error occurred to login"
        })
    }
}
export const logout = async (req, res) => {
    try {
        res.status(200).clearCookie("token", {
            sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
            secure: process.env.NODE_ENV === "development" ? false : true
        }).json({
            success: true,
            message: 'User Logged out successfully'
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            success: false,
            message: "An error occurred to logout"
        })
    }
}
export const getProfile = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            success: false,
            message: "An error occurred get profile"
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = req.user;

        // Verify old password
        const matchedOldPassword = await bcrypt.compare(oldPassword, user.password);
        if (!matchedOldPassword) {
            return res.status(401).json({
                success: false,
                message: "Old password not correct"
            });
        }
       
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password in the database
        const updatedUser = await userModel.findByIdAndUpdate(
            user._id,
            { password: hashedPassword },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred updating the profile."
        });
    }
};
