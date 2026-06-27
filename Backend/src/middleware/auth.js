import jwt from "jsonwebtoken";
import { findUserById } from "../Models/db_queries.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

export const isAuthenticated = async (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        const err = new Error("No token provided");
        err.statusCode = 401;
        return next(err);
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await findUserById(decoded.id);
        if (!user) {
            const err = new Error("User not found");
            err.statusCode = 401;
            return next(err);
        }
        req.user = user;
        return next();
    } catch (err) {
        err.statusCode = 401;
        err.message = "Invalid or expired token";
        return next(err);
    }
};