import { Position } from '../models';

export const PositionController = () => {
  const getAll = async (req: any, res: any) => {
    const positions = await Position.findAll();
    return res.status(200).json({ positions });
  };

  return {
    getAll,
  };
};

export default { PositionController };
