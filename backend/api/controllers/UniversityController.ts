import { University } from '../models';

export const UniversityController = () => {
  const getAll = async (req: any, res: any) => {
    const universities = await University.findAll();
    return res.status(200).json({ universities });
  };

  return {
    getAll,
  };
};

export default { UniversityController };
