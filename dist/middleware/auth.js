import jwt from "jsonwebtoken";
export const adminOnly = (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).json({ message: "Please Login First" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("Decoded token:", decoded);
        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    }
    catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({ message: "Some thing went wrong" });
    }
};
