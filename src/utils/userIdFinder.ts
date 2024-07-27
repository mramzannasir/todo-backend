import jwt from "jsonwebtoken";
import { Request } from "express";

export const userIdFinder = (req: Request): string | null => {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      throw new Error("No token found");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
      userId: string;
    };
    return decoded.userId;
  } catch (error) {
    console.error("Error extracting userId from token:", error);
    return null;
  }
};
