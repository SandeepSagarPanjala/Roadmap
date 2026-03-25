import jwt from "jsonwebtoken";
import { MESSAGES } from "../constants/messages.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET) {
  throw new Error("FATAL: ACCESS_TOKEN_SECRET is missing from .env!");
}

export const authenticateToken = (req, res, next) => {
  // Try getting token from header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: MESSAGES.AUTH.ACCESS_TOKEN_MISSING });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      // 401 means Authentication Failed (Token is expired or completely invalid)
      // 403 is for Authorization (You are a User trying to hit an Admin route)
      return res
        .status(401)
        .json({ message: MESSAGES.AUTH.ACCESS_TOKEN_INVALID });
    }

    // Attach the user information to the request object so next handlers can use it
    req.user = user;
    next();
  });
};
