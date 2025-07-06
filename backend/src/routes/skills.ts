import { Router } from "express";
import * as skillsController from "../controllers/skills";
import {
  validateCreateSkillRequest,
  validateGetSkillByIdRequest,
  validateUpdateSkillRequest,
} from "../middlewares/validations";
import { authenticateReq, authenticateAndAuthorizeReq } from "../middlewares/auth";
import { UserRole } from "../models/user";

const skillsRouter = Router({ mergeParams: true });

skillsRouter
  .route("/skills")
  .get(authenticateReq, skillsController.listSkills)
  .post(
    authenticateAndAuthorizeReq(UserRole.Provider),
    validateCreateSkillRequest(),
    skillsController.createSkill,
  );

skillsRouter
  .route("/skills/:id")
  .get(validateGetSkillByIdRequest(), skillsController.getSkillById)
  .put(
    authenticateAndAuthorizeReq(UserRole.Provider),
    validateUpdateSkillRequest(),
    skillsController.updateSkill,
  );

export default skillsRouter;
