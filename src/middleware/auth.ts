import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: "Please Login First" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
      role: string;
    };
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Some thing went wrong" });
  }
};

export const authenticatedUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.authToken;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Please Login First" });
  }

  try {
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    if (!decodeToken) {
      return res
        .status(401)
        .json({ success: false, message: "Please Login First" });
    }

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Some thing went wrong" });
  }
};
