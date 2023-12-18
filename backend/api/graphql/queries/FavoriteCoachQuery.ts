import { GraphQLInt, GraphQLUnionType } from 'graphql';
import { Profile, FavoriteCoach } from '../../models';
import {
  FavoriteCoachConnectionType,
  FavoriteCoachType,
} from '../types/FavoriteCoachType';

const modelFilterParams: ('playerProfileId' | 'coachProfileId')[] = [
  'playerProfileId',
  'coachProfileId',
];

export const favoriteCoachQuery = {
  type: new GraphQLUnionType({
    name: 'FavoriteCoachUnion',
    types: [FavoriteCoachType, FavoriteCoachConnectionType],
    resolveType(value: unknown) {
      return value instanceof FavoriteCoach
        ? FavoriteCoachType
        : FavoriteCoachConnectionType;
    },
  }),
  args: {
    coachProfileId: { name: 'coachProfileId', type: GraphQLInt },
    playerProfileId: { name: 'playerProfileId', type: GraphQLInt },
    limit: { name: 'limit', type: GraphQLInt },
    offset: { name: 'offset', type: GraphQLInt },
  },

  resolve: async (
    favoriteCoach: any,
    favoriteCoachQueryArgs: {
      playerProfileId?: number;
      coachProfileId?: number;
      limit?: number;
      offset?: number;
    }
  ) => {
    const { limit = 20, offset = 0 } = favoriteCoachQueryArgs;

    const filtersSet = (
      modelFilterParams
        .filter((p) => p in favoriteCoachQueryArgs && favoriteCoachQueryArgs[p])
        .map((filterParam) => ({
          ...(favoriteCoachQueryArgs[filterParam] ||
          favoriteCoachQueryArgs[filterParam] === 0
            ? { [filterParam]: favoriteCoachQueryArgs[filterParam] }
            : {}),
        })) as ({ playerProfileId?: number } | { coachProfileId?: number })[]
    ).reduce((acc, filter) => ({ ...acc, ...filter }), {});

    const favoriteCoaches = await FavoriteCoach.findAndCountAll({
      distinct: true,
      subQuery: false,
      ...(limit ? { limit } : {}),
      ...(offset ? { offset } : {}),
      where: filtersSet,
      include: [
        {
          model: Profile,
          as: 'coach',
          include: [{ model: Profile, as: 'coach' }],
        },
        {
          model: Profile,
          as: 'player',
          include: [{ model: Profile, as: 'player' }],
        },
      ],
    });

    return {
      total: Array.isArray(favoriteCoaches.count)
        ? favoriteCoaches.count.length
        : favoriteCoaches.count,
      edges: favoriteCoaches.rows.map((x) => ({ node: x })),
    };
  },
};
