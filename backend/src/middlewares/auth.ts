import { constants } from "node:http2";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { UserRole } from "../models/user.js";

type UserData = {
  id: number;
  role: UserRole;
  email: string;
};

export type RequestWithSession = Request & {
  session?: UserData;
};

export const validateJWT = async (
  req: RequestWithSession,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({ error: "Unauthorized" });
    return;
  }
  const [_, token] = authHeader.split(" ");
  try {
    const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as UserData;
    req.session = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    return next();
  } catch (error) {
    res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({ error: "Invalid token" });
    return;
  }
};

export const validateRole = (role: UserRole) => {
  return (req: RequestWithSession, res: Response, next: NextFunction) => {
    if (req.session?.role !== role) {
      res.status(constants.HTTP_STATUS_FORBIDDEN).json({ error: "Forbidden" });
      return;
    }
    next();
  };
};
