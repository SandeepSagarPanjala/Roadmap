import Joi from "joi";
// Import our business logic (the Service)
import * as userService from "../services/userService.js";

export const getAllUsers = (req, res) => {
  // Call the service to get raw data
  const users = userService.getAllUsers();
  // The controller's ONLY job is to send the HTTP response
  res.json(users);
};

export const getUserById = (req, res) => {
  const user = userService.getUserById(req.params.id);

  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  res.status(200).json(user);
};

export const addUser = (req, res) => {
  // Validation belongs in the Controller (or a separate Validation Middleware)
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // Pass validated data down to the Service
  const newUser = userService.addUser(req.body.name);

  res.status(201).json(newUser);
};
