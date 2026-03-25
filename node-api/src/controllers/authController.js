import Joi from "joi";
import * as authService from "../services/authService.js";

export const login = async (req, res) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const user = await authService.authenticateUser(
    req.body.username,
    req.body.password,
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const accessToken = authService.generateAccessToken(user);
  const refreshToken = authService.generateRefreshToken(user);

  // Consider placing refreshToken in an HttpOnly cookie for better security
  // res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.status(200).json({
    accessToken,
    refreshToken,
    user,
  });
};

export const refresh = (req, res) => {
  // Try to get token from body, or headers, etc.
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ message: "Refresh Token is required" });
  }

  const result = authService.verifyRefreshToken(token);

  if (!result.valid) {
    return res
      .status(403)
      .json({ message: result.message || "Refresh Token is invalid or expired" });
  }

  const user = result.user;

  // Rotate refresh token
  authService.markTokenAsUsed(token);
  const newAccessToken = authService.generateAccessToken(user);
  const newRefreshToken = authService.generateRefreshToken(user);

  res.status(200).json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
};

export const logout = (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Refresh Token is required" });
  }

  if (authService.removeRefreshToken(token)) {
    // If you used HttpOnly cookies for refresh token, clear it here:
    // res.clearCookie('jwt');
    return res.status(200).json({ message: "Logged out successfully" });
  }

  return res.status(403).json({ message: "Token not found" });
};
