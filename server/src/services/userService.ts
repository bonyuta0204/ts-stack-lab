import { PrismaClient, User } from "@prisma/client";
import { hash } from "bcrypt";
import { readUserFromCache, writeUserToCache } from "./cacheService";
import { ILogger } from "../config/logger";

const prisma = new PrismaClient();

export type UserResponse = Omit<User, "password">;

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
}

export class UserService {
  async getUsers(
    page: number = 1,
    pageSize: number = 50,
    logger: ILogger = console
  ): Promise<PaginatedResponse<UserResponse>> {
    const skip = (page - 1) * pageSize;

    const cachedUsers = await readUserFromCache(skip, skip + pageSize - 1);
    if (cachedUsers) {
      logger.info("Fetched users from cache");
      return {
        items: cachedUsers,
        total: cachedUsers.length,
        page,
        pageSize,
        totalPages: 1,
      };
    }

    logger.info("Fetching all users list from database");
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

    logger.info("Writing users list to cache");
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

    return {
      items: users,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  async getUser(
    id: number,
    logger: ILogger = console
  ): Promise<UserResponse | null> {
    logger.info("Getting user by id", { id });
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async createUser(
    data: CreateUserData,
    logger: ILogger = console
  ): Promise<UserResponse> {
    logger.info("Creating new user", { email: data.email });
    const hashedPassword = await hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        ...data,
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

    return user;
  }

  async updateUser(
    id: number,
    data: UpdateUserData,
    logger: ILogger = console
  ): Promise<UserResponse> {
    logger.info("Updating user", { id });
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deleteUser(id: number, logger: ILogger = console): Promise<void> {
    logger.info("Deleting user", { id });
    await prisma.user.delete({
      where: { id },
    });
  }
}

export const userService = new UserService();
