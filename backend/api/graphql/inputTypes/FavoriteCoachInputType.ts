const {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
} = require('graphql');

const FavoriteCoachInputType = (type: string) => {
  const allGraphFields = {
    coachProfileId: { type: new GraphQLNonNull(GraphQLInt) },
    playerProfileId: { type: new GraphQLNonNull(GraphQLInt) },
  };

  const favoriteCoachInputType = new GraphQLInputObjectType({
    name: `FavoriteCoachInputType${
      type[0].toUpperCase() + type.slice(1, type.length)
    }`,
    description: 'This represents a FavoriteCoachInputType',
    fields: allGraphFields,
  });

  return favoriteCoachInputType;
};
export { FavoriteCoachInputType };
