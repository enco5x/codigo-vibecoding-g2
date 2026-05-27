import { prisma } from "../config/db.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export const usersService = {
  async create(userData) {
    if (!userData.name || userData.name.trim().length === 0) {
      throw new Error("Name is required");
    }
    if (userData.name.length > 40) {
      throw new Error("Name must be at most 40 characters");
    }
    if (!userData.lastname || userData.lastname.trim().length === 0) {
      throw new Error("Lastname is required");
    }
    if (userData.lastname.length > 40) {
      throw new Error("Lastname must be at most 40 characters");
    }
    if (!userData.email || userData.email.trim().length === 0) {
      throw new Error("Email is required");
    }
    if (userData.email.length > 60) {
      throw new Error("Email must be at most 60 characters");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      throw new Error("Invalid email format");
    }
    if (!userData.password || userData.password.length === 0) {
      throw new Error("Password is required");
    }
    if (userData.password.length > 60) {
      throw new Error("Password must be at most 60 characters");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return await prisma.user.create({
      data: {
        name: userData.name.trim(),
        lastname: userData.lastname.trim(),
        email: userData.email.trim().toLowerCase(),
        password: hashedPassword
      }
    });
  },

  async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
  },

  async validatePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  },

  async updateToken(userId) {
    const token = uuidv4();
    return await prisma.user.update({
      where: { id: userId },
      data: { token },
      select: { id: true, name: true, email: true, token: true }
    });
  },

  async findByToken(token) {
    return await prisma.user.findUnique({
      where: { token },
      include: { tasks: true }
    });
  }
};