import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as userService from "./userService.js";

// In a real application, refresh tokens should be stored in a database
// with their associated user, expiration date, and optionally the device/IP.
const refreshTokens = [];

// Fallback secrets in case .env is missing them
const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET ||
  "fallback_access_secret_do_not_use_in_prod";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET ||
  "fallback_refresh_secret_do_not_use_in_prod";

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
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "15m" }); // 15 minutes is typical for access token
};

export const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign(
    { id: user.id, username: user.username },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );
  refreshTokens.push(refreshToken);
  return refreshToken;
};

export const verifyRefreshToken = (token) => {
  if (!refreshTokens.includes(token)) {
    return null;
  }

  try {
    const payload = jwt.verify(token, REFRESH_TOKEN_SECRET);
    // Return a payload we can use to generate new tokens
    const user = userService.getUserById(payload.id);
    return user;
  } catch (err) {
    return null;
  }
};

export const removeRefreshToken = (token) => {
  const index = refreshTokens.indexOf(token);
  if (index > -1) {
    refreshTokens.splice(index, 1);
    return true;
  }
  return false;
};
