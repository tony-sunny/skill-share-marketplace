import type { Request, Response } from "express";
import { constants } from "node:http2";
import * as skillModel from "../models/skill.js";
import type { RequestWithSession } from "../middlewares/auth.js";

export const createSkill = async (req: RequestWithSession, res: Response) => {
  try {
    const skill = {
      ...req.body,
      user_id: req.session?.id,
    }
    await skillModel.createSkill(skill);
    res.status(constants.HTTP_STATUS_CREATED).end()
  } catch (e) {
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Create skill failed", details: e });
  }
};

export const updateSkill = async (req: RequestWithSession, res: Response) => {
  try {
    const skillId = Number(req.params.id);
    const skill = await skillModel.getSkillById(skillId);
    if (!skill) {
      res.status(constants.HTTP_STATUS_NOT_FOUND).json({ error: "Skill not found" });
      return;
    }
    if (skill.user_id !== req.session?.id) {
      res.status(constants.HTTP_STATUS_FORBIDDEN).json({ error: "You are not allowed to update this skill" });
      return;
    }
    const updatedSkill = await skillModel.updateSkill(skillId, {
      ...req.body,
      user_id: req.session?.id,
    });
    res.status(constants.HTTP_STATUS_CREATED).json(updatedSkill);
  } catch (e) {
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Update skill failed", details: e });
  }
};

export const listSkills = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const [skills, total] = await Promise.all([
      skillModel.listSkills({ offset, limit }),
      skillModel.countSkills()
    ]);
    const mappedSkills = skills.map(skill => ({
      id: skill.id,
      category: skill.category,
      experience: skill.experience,
      nature_of_work: skill.nature_of_work,
      hourly_rate: skill.hourly_rate,
    }));

    res.status(constants.HTTP_STATUS_OK).json({
      skills: mappedSkills,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit)
      }
    });
  } catch (e) {
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "List skills failed", details: e });
  }
};

export const getSkillById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const skill = await skillModel.getSkillById(id);

    if (!skill) {
      res.status(constants.HTTP_STATUS_NOT_FOUND).json({ error: "Skill not found" });
      return;
    }
    const mappedSkill = {
      id: skill.id,
      category: skill.category,
      experience: skill.experience,
      nature_of_work: skill.nature_of_work,
      hourly_rate: skill.hourly_rate,
    }
    res.status(constants.HTTP_STATUS_OK).json(mappedSkill);
  } catch (e) {
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Get skill failed", details: e });
  }
};
