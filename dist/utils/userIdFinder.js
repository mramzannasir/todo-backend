import jwt from "jsonwebtoken";
export const userIdFinder = (req) => {
    try {
        const token = req.cookies.authToken;
        if (!token) {
            throw new Error("No token found");
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return decoded.userId;
    }
    catch (error) {
        console.error("Error extracting userId from token:", error);
        return null;
    }
};
