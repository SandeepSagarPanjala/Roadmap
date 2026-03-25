import Joi from "joi";
import { Request, Response } from "express";
// Import our business logic (the Service)
import * as userService from "../services/userService.js";

export const getAllUsers = (req: Request, res: Response) => {
  // Call the service to get raw data
  const users = userService.getAllUsers();
  // The controller's ONLY job is to send the HTTP response
  res.json(users);
};

export const getUserById = (req: Request, res: Response) => {
  const user = userService.getUserById(req.params.id as string);

  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  res.status(200).json(user);
};

export const addUser = async (req: Request, res: Response) => {
  // Validation belongs in the Controller (or a separate Validation Middleware)
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    username: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // Pass validated data down to the Service
  const bcrypt = await import("bcrypt");
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newUser = userService.addUser(
    req.body.name,
    req.body.username,
    hashedPassword,
  );

  res.status(201).json(newUser);
};
