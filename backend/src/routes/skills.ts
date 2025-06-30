import { Router } from "express";
import * as skillsController from "../controllers/skills";
import { validateCreateSkillRequest, validateGetSkillByIdRequest, validateUpdateSkillRequest } from "../middlewares/validations";
import { validateJWT, validateRole } from "../middlewares/auth";
import { UserRole } from "../models/user";

const skillsRouter = Router({ mergeParams: true });

skillsRouter.route("/skills")
  .get(
    validateJWT,
    skillsController.listSkills)
  .post(
    validateJWT,
    validateRole(UserRole.Provider),
    validateCreateSkillRequest(),
    skillsController.createSkill
  );

skillsRouter.route("/skills/:id")
  .get(
    validateGetSkillByIdRequest(),
    skillsController.getSkillById
  )
  .put(
    validateJWT,
    validateRole(UserRole.Provider),
    validateUpdateSkillRequest(),
    skillsController.updateSkill
  );

export default skillsRouter;
