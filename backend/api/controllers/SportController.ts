import { Sport } from '../models';

export const SportController = () => {
  const getAll = async (req: any, res: any) => {
    const sports = await Sport.findAll();
    return res.status(200).json({ sports });
  };

  return {
    getAll,
  };
};

export default { SportController };
