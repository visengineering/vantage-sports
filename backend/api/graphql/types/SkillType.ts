const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} = require('graphql');

import { SportType } from './SportType';

const SkillType = new GraphQLObjectType({
  name: 'Skill',
  description: 'This represents a Skill',
  fields: () => ({
    id: { type: GraphQLInt, resolve: (skill: any) => skill.id },
    name: { type: GraphQLString, resolve: (skill: any) => skill.name },
    sport: { type: SportType, resolve: (coach: any) => coach.getSport() },
    createdAt: {
      type: GraphQLString,
      resolve: (skill: any) => skill.createdAt,
    },
    updatedAt: {
      type: GraphQLString,
      resolve: (skill: any) => skill.updatedAt,
    },
  }),
});

export { SkillType };
export default { SkillType };
