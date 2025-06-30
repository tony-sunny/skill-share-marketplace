import { Router } from "express";
import * as authController from "../controllers/auth.js";
import {
  validateLoginRequest,
  validateSignUpRequest,
} from "../middlewares/validations.js";

const authRouter = Router({ mergeParams: true });

authRouter
  .route("/auth/signup")
  .post(validateSignUpRequest(), authController.signUp);

authRouter
  .route("/auth/login")
  .post(validateLoginRequest(), authController.login);

export default authRouter;
