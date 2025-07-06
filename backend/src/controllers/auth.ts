import type { Request, Response } from "express";
import { constants } from "node:http2";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/user";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password, ...rest } = req.body;
    const existing = await findUserByEmail(email);
    if (existing) {
      res.status(constants.HTTP_STATUS_CONFLICT).end();
      return;
    }
    const password_hash = await bcrypt.hash(password, 10);
    await createUser({ ...rest, email, password_hash });
    res.status(constants.HTTP_STATUS_CREATED).end();
  } catch (e) {
    res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ error: "Signup failed", details: e });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      res
        .status(constants.HTTP_STATUS_UNAUTHORIZED)
        .json({ error: "Invalid credentials" });
      return;
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res
        .status(constants.HTTP_STATUS_UNAUTHORIZED)
        .json({ error: "Invalid credentials" });
      return;
    }
    const userData = {
      id: user.id,
      role: user.role,
      email: user.email,
    };
    const token = jwt.sign(userData, process.env.JWT_SECRET!);
    res.status(constants.HTTP_STATUS_OK).json({ token });
  } catch (e) {
    res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ error: "Signup failed", details: e });
  }
};
