import { Request, RequestHandler, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
import { hash } from "bcrypt";
import RedisClient from "@redis/client/dist/lib/client";
import { redisClient } from "../config/redisClient";
import { readUserFromCache, writeUserToCache } from "../services/cacheService";
import { write } from "fs";

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

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

type ErrorResponse = {
  error: string;
};

// Get all users
export async function getUsers(
  req: Request,
  res: Response<PaginatedResponse<UserResponse> | ErrorResponse>
) {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 50;
    const skip = (page - 1) * pageSize;

    const cachedUsers = await readUserFromCache(skip, skip + pageSize - 1);
    if (cachedUsers) {
      console.log("Fetched users from cache");
      res.json({
        items: cachedUsers,
        total: cachedUsers.length,
        page,
        pageSize,
        totalPages: 1,
      });
      return;
    }

    // Fetch users from the database and add it to cache
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    await writeUserToCache(allUsers);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: pageSize,
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          id: "asc",
        },
      }),
      prisma.user.count(),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    res.json({
      items: users,
      total,
      page,
      pageSize,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

// Get single user
export const getUser: RequestHandler = async (
  req: Request,
  res: Response<UserResponse | ErrorResponse>
) => {
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
      res.status(404).json({ error: "User not found" });
    } else {
      res.json(user);
    }
  } catch {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// Create user
export const createUser: RequestHandler = async (
  req: Request<object, UserResponse, CreateUserRequest>,
  res: Response<UserResponse | ErrorResponse>
) => {
  try {
    const { email, name, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
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
  } catch {
    res.status(500).json({ error: "Failed to create user" });
  }
};

// Update user
export async function updateUser(
  req: Request<{ id: string }, UserResponse, UpdateUserRequest>,
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
  } catch {
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
  } catch {
    res.status(500).json({ error: "Failed to delete user" });
  }
}
