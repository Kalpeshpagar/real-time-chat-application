import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try {
        let token;

        // Prefer standard Authorization header: Bearer <token>
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1].trim();
        } else if (req.headers.token) {
            // Fallback: legacy custom header
            token = req.headers.token;
        } else if (req.query && req.query.token) {
            // Fallback: query param (useful for testing)
            token = req.query.token;
        }

        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized, token missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ success: false, message: "Not authorized, user not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in auth middleware:", error);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Not authorized, token expired" });
        }
        res.status(401).json({ success: false, message: "Not authorized, token invalid" });
    }
}

