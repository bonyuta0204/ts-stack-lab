import { Request, Response } from "express";
import {
  userService,
  UserResponse,
  PaginatedResponse,
  CreateUserData,
  UpdateUserData,
} from "../services/userService";

type ErrorResponse = {
  error: string;
};

// Get all users
export async function getUsers(
  req: Request,
  res: Response<PaginatedResponse<UserResponse> | ErrorResponse>
) {
  req.logger.info("Getting users list", { query: req.query });
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 50;

    const result = await userService.getUsers(page, pageSize, req.logger);
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      req.logger.error(error.message);
    }
    res.status(500).json({ error: "Failed to get users" });
  }
}

// Get single user
export async function getUser(
  req: Request,
  res: Response<UserResponse | ErrorResponse>
): Promise<void> {
  const { id } = req.params;
  req.logger.info("Getting user", { id });

  try {
    const user = await userService.getUser(Number(id), req.logger);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    req.logger.error("Error getting user", { error });
    res.status(500).json({ error: "Failed to get user" });
  }
}

// Create user
export async function createUser(
  req: Request<object, UserResponse, CreateUserData>,
  res: Response<UserResponse | ErrorResponse>
) {
  const userData = req.body;
  req.logger.info("Creating user", { email: userData.email });

  try {
    const user = await userService.createUser(userData, req.logger);
    res.status(201).json(user);
  } catch (error) {
    req.logger.error("Error creating user", { error });
    res.status(500).json({ error: "Failed to create user" });
  }
}

// Update user
export async function updateUser(
  req: Request<{ id: string }, UserResponse, UpdateUserData>,
  res: Response<UserResponse | ErrorResponse>
) {
  const { id } = req.params;
  const updateData = req.body;
  req.logger.info("Updating user", { id });

  try {
    const user = await userService.updateUser(
      Number(id),
      updateData,
      req.logger
    );
    res.json(user);
  } catch (error) {
    req.logger.error("Error updating user", { error });
    res.status(500).json({ error: "Failed to update user" });
  }
}

// Delete user
export async function deleteUser(
  req: Request<{ id: string }>,
  res: Response<void | ErrorResponse>
) {
  const { id } = req.params;
  req.logger.info("Deleting user", { id });

  try {
    await userService.deleteUser(Number(id), req.logger);
    res.status(204).send();
  } catch (error) {
    req.logger.error("Error deleting user", { error });
    res.status(500).json({ error: "Failed to delete user" });
  }
}
