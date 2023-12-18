import { GraphQLInt, GraphQLNonNull } from 'graphql';
import { FavoriteCoach } from '../../models';
import { FavoriteCoachType } from '../types/FavoriteCoachType';

export const removeFavoriteCoach = {
  type: FavoriteCoachType,
  description:
    'The mutation that allows you to remove an existing favorited coach by coachProfileId',
  args: {
    coachProfileId: { type: new GraphQLNonNull(GraphQLInt) },
    playerProfileId: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve: async (
    value: any,
    {
      coachProfileId,
      playerProfileId,
    }: { coachProfileId: number; playerProfileId: number }
  ) => {
    if (!(playerProfileId || playerProfileId === 0)) {
      throw new Error(`(#000052) Missing player profile id!`);
    }

    if (!(coachProfileId || coachProfileId === 0)) {
      throw new Error(`(#000053) Missing coach profile id!`);
    }

    const foundFavoriteCoach = await FavoriteCoach.findOne({
      where: {
        coachProfileId: coachProfileId,
        playerProfileId: playerProfileId,
      },
    });

    if (!foundFavoriteCoach) {
      throw new Error(
        `(#000051) Favorite coach with profile id: ${
          coachProfileId ?? '<<id_not_provided>>'
        } and player profile id ${
          playerProfileId ?? '<<id_not_provided>>'
        } not found!`
      );
    }

    const destroyedCount = await FavoriteCoach.destroy({
      where: {
        coachProfileId: coachProfileId,
        playerProfileId: playerProfileId,
      },
    });

    if (destroyedCount === 0) {
      throw new Error(
        `(#000054) Performed destroy on Favorite Coach but destroyed 0 rows.`
      );
    }

    return {};
  },
};

export const addFavoriteCoach = {
  type: FavoriteCoachType,
  description:
    'The mutation that allows you to add favorited coach by coachProfileId',
  args: {
    coachProfileId: { type: new GraphQLNonNull(GraphQLInt) },
    playerProfileId: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve: async (
    value: any,
    {
      coachProfileId,
      playerProfileId,
    }: { coachProfileId: number; playerProfileId: number }
  ) => {
    if (!(playerProfileId || playerProfileId === 0)) {
      throw new Error(`(#000055) Missing player profile id!`);
    }

    if (!(coachProfileId || coachProfileId === 0)) {
      throw new Error(`(#000056) Missing coach profile id!`);
    }

    const foundFavoriteCoach = await FavoriteCoach.findOne({
      where: {
        coachProfileId: coachProfileId,
        playerProfileId: playerProfileId,
      },
    });

    if (foundFavoriteCoach) {
      throw new Error(
        `(#000057) Favorite coach already exists for coach profile id: ${
          coachProfileId ?? '<<id_not_provided>>'
        } and player profile id ${playerProfileId ?? '<<id_not_provided>>'}!`
      );
    }

    const created: FavoriteCoach = await FavoriteCoach.create({
      coachProfileId: coachProfileId,
      playerProfileId: playerProfileId,
    });

    return created;
  },
};
