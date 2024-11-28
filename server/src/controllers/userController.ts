import { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

// Types for request bodies
interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
}

interface UpdateUserRequest {
  email?: string;
  name?: string;
}

// Types for responses
type UserResponse = Omit<User, "password">;

type ErrorResponse = {
  error: string;
};

// Get all users
export async function getUsers(
  req: Request,
  res: Response<UserResponse[] | ErrorResponse>
) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

// Get single user
export async function getUser(
  req: Request<{ id: string }>,
  res: Response<UserResponse | ErrorResponse>
) {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
}

// Create user
export async function createUser(
  req: Request<{}, {}, CreateUserRequest>,
  res: Response<UserResponse | ErrorResponse>
) {
  try {
    const { email, name, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
}

// Update user
export async function updateUser(
  req: Request<{ id: string }, {}, UpdateUserRequest>,
  res: Response<UserResponse | ErrorResponse>
) {
  try {
    const { id } = req.params;
    const { email, name } = req.body;

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        ...(email && { email }),
        ...(name && { name }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
}

// Delete user
export async function deleteUser(
  req: Request<{ id: string }>,
  res: Response<void | ErrorResponse>
) {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
}
