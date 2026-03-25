import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as userService from "./userService.js";
import { MESSAGES } from "../constants/messages.js";

// In a real application, refresh tokens should be stored in a database
// with their associated user, expiration date, and optionally the device/IP.
const refreshTokensDB = new Map();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error("FATAL: JWT Secrets are completely missing from .env!");
}

export const authenticateUser = async (username, password) => {
  const user = userService.getUserByUsername(username);

  if (!user) {
    return null;
  }

  // Real user object has password (from getUserByUsername which accesses the raw array)
  // Wait, my getUserByUsername returns the object reference from the array, which has password!
  const match = await bcrypt.compare(password, user.password);

  if (match) {
    // Exclude password from token payload
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  return null;
};

export const generateAccessToken = (user) => {
  const expiry = process.env.ACCESS_TOKEN_EXPIRY || "15m";
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: expiry });
};

export const generateRefreshToken = (user) => {
  const expiry = process.env.REFRESH_TOKEN_EXPIRY || "7d";
  const refreshToken = jwt.sign(
    { id: user.id, username: user.username },
    REFRESH_TOKEN_SECRET,
    { expiresIn: expiry },
  );
  refreshTokensDB.set(refreshToken, { userId: user.id, used: false });
  return refreshToken;
};

export const invalidateAllTokensForUser = (userId) => {
  for (const [token, data] of refreshTokensDB.entries()) {
    if (data.userId === userId) {
      refreshTokensDB.delete(token);
    }
  }
};

export const verifyRefreshToken = (token) => {
  const tokenData = refreshTokensDB.get(token);

  if (!tokenData) {
    return { valid: false, user: null, message: MESSAGES.AUTH.TOKEN_NOT_FOUND };
  }

  if (tokenData.used) {
    // Token reuse detected!
    invalidateAllTokensForUser(tokenData.userId);
    return { valid: false, user: null, message: MESSAGES.AUTH.TOKEN_REUSE_DETECTED };
  }

  try {
    const payload = jwt.verify(token, REFRESH_TOKEN_SECRET);
    // Return a payload we can use to generate new tokens
    const user = userService.getUserById(payload.id);
    return { valid: true, user };
  } catch (err) {
    return { valid: false, user: null, message: MESSAGES.AUTH.INVALID_OR_EXPIRED_TOKEN };
  }
};

export const markTokenAsUsed = (token) => {
  const tokenData = refreshTokensDB.get(token);
  if (tokenData) {
    tokenData.used = true;
  }
};

export const removeRefreshToken = (token) => {
  return refreshTokensDB.delete(token);
};
