import Joi from "joi";
import { Request, Response } from "express";
import * as authService from "../services/authService.js";
import { MESSAGES } from "../constants/messages.js";

export const login = async (req: Request, res: Response) => {
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
    return res.status(401).json({ message: MESSAGES.AUTH.INVALID_CREDENTIALS });
  }

  const accessToken = authService.generateAccessToken(user);
  const refreshToken = authService.generateRefreshToken(user);

  // Send the ultra-secure HttpOnly Cookie directly to Chrome
  const maxAgeMs = process.env.COOKIE_MAX_AGE_MS ? parseInt(process.env.COOKIE_MAX_AGE_MS, 10) : 7 * 24 * 60 * 60 * 1000;
  
  res.cookie('jwt', refreshToken, { 
    httpOnly: true, // Javascript CANNOT read this
    secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    sameSite: 'strict', // Stop CSRF Fake Links
    maxAge: maxAgeMs // Fully decoupled
  });

  res.status(200).json({
    accessToken,
    user,
  });
};

export const refresh = async (req: Request, res: Response) => {
  // Read the cookie directly from the invisible browser headers
  const token = req.cookies?.jwt;

  if (!token) {
    return res.status(401).json({ message: MESSAGES.AUTH.REFRESH_COOKIE_MISSING });
  }

  const result = await authService.verifyRefreshToken(token);

  if (!result.valid) {
    return res
      .status(403)
      .json({ message: result.message || MESSAGES.AUTH.REFRESH_TOKEN_INVALID });
  }

  const user = result.user;

  // Rotate refresh token securely
  authService.markTokenAsUsed(token);
  const newAccessToken = authService.generateAccessToken(user);
  const newRefreshToken = authService.generateRefreshToken(user);

  const maxAgeMs = process.env.COOKIE_MAX_AGE_MS ? parseInt(process.env.COOKIE_MAX_AGE_MS, 10) : 7 * 24 * 60 * 60 * 1000;

  res.cookie('jwt', newRefreshToken, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict', 
    maxAge: maxAgeMs 
  });

  res.status(200).json({
    accessToken: newAccessToken,
  });
};

export const logout = (req: Request, res: Response) => {
  const token = req.cookies?.jwt;

  if (!token) {
    // If they have no cookie, just pretend it was successful so the frontend can clean up
    return res.status(200).json({ message: MESSAGES.AUTH.ALREADY_LOGGED_OUT });
  }

  // Delete from our Backend Memory
  authService.removeRefreshToken(token);

  // Instruct Chrome to permanently destroy the cookie
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'strict' });
  
  return res.status(200).json({ message: MESSAGES.AUTH.LOGGED_OUT_SUCCESS });
};
