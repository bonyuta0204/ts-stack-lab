import { Request, Response } from "express";
import {
  PaginatedResponse,
  UserResponse,
  CreateUserData,
  UpdateUserData,
  userService,
} from "../services/userService.js";
import { ErrorResponse } from "../middleware/errorHandler.js";

export const getUsers = async (
  req: Request,
  res: Response<PaginatedResponse<UserResponse>>,
) => {
  req.logger.info("Getting users list", { query: req.query });

  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 50;

  const result = await userService.getUsers(page, pageSize, req.logger);
  res.json(result);
};

export const getUser = async (
  req: Request,
  res: Response<UserResponse | ErrorResponse>,
) => {
  const { id } = req.params;
  req.logger.info("Getting user", { id });

  const user = await userService.getUser(Number(id), req.logger);
  if (!user) {
    res.status(404).json({ status: "error", message: "User not found" });
    return;
  }
  res.json(user);
};

export const createUser = async (
  req: Request<object, UserResponse, CreateUserData>,
  res: Response<UserResponse>,
) => {
  const userData = req.body;
  req.logger.info("Creating user", { email: userData.email });

  const user = await userService.createUser(userData, req.logger);
  res.status(201).json(user);
};

export const updateUser = async (
  req: Request<{ id: string }, UserResponse, UpdateUserData>,
  res: Response<UserResponse>,
) => {
  const { id } = req.params;
  const userData = req.body;
  req.logger.info("Updating user", { id, ...userData });

  const user = await userService.updateUser(Number(id), userData, req.logger);
  res.json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  req.logger.info("Deleting user", { id });

  await userService.deleteUser(Number(id), req.logger);
  res.status(204).send();
};
