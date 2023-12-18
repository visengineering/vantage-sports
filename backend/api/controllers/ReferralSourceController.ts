import { ReferralSource } from '../models';

export const ReferralSourceController = () => {
  const getAll = async (req: any, res: any) => {
    const referrers = await ReferralSource.findAll();
    return res.status(200).json({ referrers });
  };

  return {
    getAll,
  };
};

export default { ReferralSourceController };
