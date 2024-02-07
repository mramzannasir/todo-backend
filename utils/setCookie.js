import jwt from "jsonwebtoken"


export const setCookie = (user, res, message, code) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(code).cookie("token", token, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
        secure: process.env.NODE_ENV === "development" ? false : true
    }).json({
        success: true,
        message
    })
}