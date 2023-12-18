import { Skill } from '../models';

export const SkillController = () => {
  const getAll = async (req: any, res: any) => {
    const skills = await Skill.findAll();
    return res.status(200).json({ skills });
  };

  return {
    getAll,
  };
};

export default { SkillController };
