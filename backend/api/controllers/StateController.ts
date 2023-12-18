import { Profile, Event, Timeslot } from '../models';
import { Op, fn, col } from 'sequelize';

export const StateController = () => {
  const getAll = async (req: any, res: any) => {
    const futureEvents: any[] = await Event.findAll({
      include: [
        {
          model: Timeslot,
          as: 'timeslots',
          where: {
            startDate: { [Op.gt]: new Date() },
          },
        },
        {
          model: Profile,
          as: 'coach',
          attributes: ['state'],
          where: {
            state: {
              [Op.ne]: null,
            },
          },
        },
      ],
    });

    const coachStates: string[] = futureEvents.map(
      (event) => event.coach.state
    );

    const states = coachStates
      .filter((item, pos) => coachStates.indexOf(item) == pos)
      .filter((item) => item && item !== '')
      .map((coachState) => {
        return { state: coachState };
      });

    return res.status(200).json({ states });
  };

  return {
    getAll,
  };
};

export default { StateController };
