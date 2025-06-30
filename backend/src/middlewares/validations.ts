import { constants } from "node:http2";
import type { Request, Response, NextFunction, RequestHandler } from "express";
import { validationResult, body, query, param } from "express-validator";
import { RoleType, UserRole } from "../models/user";
import { WorkNature, Category } from "../models/skill";
import { Currency } from "../models/task";
import { OfferStatus } from "../models/offer";

const applyValidation = (
  httpStatusCode = constants.HTTP_STATUS_BAD_REQUEST,
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    } else {
      const errorDetails = errors.array();
      res.status(httpStatusCode).json({
        error: "Validation failed",
        details: errorDetails
      });
      return;
    }
  };
};

export const validateSignUpRequest = () => {
  const requiredFields = [
    "email",
    "password",
    "role",
    "role_type",
    "first_name",
    "last_name",
    "mobile",
  ];
  return [
    body(requiredFields).isString().notEmpty(),
    body("role").isIn(Object.values(UserRole)),
    body("role_type").isIn(Object.values(RoleType)),
    body(["address"])
      .if(body("role_type").equals(RoleType.Individual))
      .isString()
      .notEmpty(),
    body(["phone", "company_name", "business_tax_number"])
      .if(body("role_type").equals(RoleType.Company))
      .isString()
      .notEmpty(),
    applyValidation(),
  ];
};

export const validateLoginRequest = () => {
  const requiredFields = ["email", "password"];
  return [body(requiredFields).isString().notEmpty(), applyValidation()];
};

export const validateCreateSkillRequest = () => {
  return [
    body("category").isIn(Object.values(Category)),
    body("nature_of_work").isIn(Object.values(WorkNature)),
    body("hourly_rate").isNumeric().notEmpty(),
    applyValidation(),
  ];
}

export const validateUpdateSkillRequest = validateCreateSkillRequest

export const validateGetSkillByIdRequest = () => {
  return [
    param("id").isInt(),
    applyValidation(),
  ];
}

export const validateCreateTaskRequest = () => {
  return [
    body("name").isString().notEmpty(),
    body("expected_start_date").isDate({ format: "YYYY-MM-DD" }),
    body("description").optional().isString().notEmpty(),
    body("category").isIn(Object.values(Category)),
    body("rate_currency").isIn(Object.values(Currency)),
    body("hourly_rate").isNumeric().notEmpty(),
    body("expected_hours").optional().isNumeric().notEmpty(),
    applyValidation(),
  ];
}

export const validateUpdateTaskRequest = validateCreateTaskRequest

export const validateGetTaskByIdRequest = () => {
  return [
    param("id").isInt(),
    applyValidation(),
  ];
}

export const validateGetSkillsRequest = () => {
  return [
    query(["page", "limit"]).optional().isInt({ min: 1 , max: 100  }),
    applyValidation(),
  ];
}

export const validateUpdateOrderStatusRequest = () => {
  return [
    param("id").isInt(),
    body("status").isIn(Object.values(OfferStatus)),
    applyValidation(),
  ];
}
