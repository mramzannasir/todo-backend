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

