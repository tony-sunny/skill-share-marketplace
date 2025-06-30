import { Router } from "express";
import * as skillsController from "../controllers/skills.js";
import { validateCreateSkillRequest, validateGetSkillByIdRequest, validateUpdateSkillRequest } from "../middlewares/validations.js";
import { validateJWT, validateRole } from "../middlewares/auth.js";
import { UserRole } from "../models/user.js";

const skillsRouter = Router({ mergeParams: true });

skillsRouter.route("/skills")
  .get(skillsController.listSkills)
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
