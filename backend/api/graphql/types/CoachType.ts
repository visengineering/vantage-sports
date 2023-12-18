import { UserType } from './UserType';
import { SportType } from './SportType';
import { SkillType } from './SkillType';
import { UniversityType } from './UniversityType';
import { MediaType } from './MediaType';
import { PositionType } from './PositionType';

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLList,
} = require('graphql');

const CoachType = new GraphQLObjectType({
  name: 'Coach',
  description: 'This represents a User',
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve: (coach: any) => (coach.node ? coach.node.id : coach.id),
    },
    user: {
      type: UserType,
      resolve: (coach: any) =>
        coach.node ? coach.node.getUser() : coach.getUser(),
    },
    name: {
      type: GraphQLString,
      resolve: (coach: any) => (coach.node ? coach.node.name : coach.name),
    },
    userType: {
      type: GraphQLInt,
      resolve: (coach: any) =>
        coach.node ? coach.node.userType : coach.userType,
    },
    sport: {
      type: SportType,
      resolve: (coach: any) =>
        coach.node ? coach.node.getSport() : coach.getSport(),
    },
    university: {
      type: UniversityType,
      resolve: (coach: any) =>
        coach.node ? coach.node.getUniversity() : coach.getUniversity(),
    },
    city: {
      type: GraphQLString,
      resolve: (coach: any) => (coach.node ? coach.node.city : coach.city),
    },
    state: {
      type: GraphQLString,
      resolve: (coach: any) => (coach.node ? coach.node.state : coach.state),
    },
    zip: {
      type: GraphQLString,
      resolve: (coach: any) => (coach.node ? coach.node.zip : coach.zip),
    },
    primaryPosition: {
      type: PositionType,
      resolve: (coach: any) =>
        coach.node
          ? coach.node.getPrimaryPosition()
          : coach.getPrimaryPosition(),
    },
    secondaryPosition: {
      type: PositionType,
      resolve: (coach: any) =>
        coach.node
          ? coach.node.getSecondaryPosition()
          : coach.getSecondaryPosition(),
    },
    skill: {
      type: GraphQLString,
      resolve: (coach: any) => (coach.node ? coach.node.skill : coach.skill),
    },
    skill1: {
      type: SkillType,
      resolve: (coach: any) =>
        coach.node ? coach.node.getSkill1() : coach.getSkill1(),
    },
    skill2: {
      type: SkillType,
      resolve: (coach: any) =>
        coach.node ? coach.node.getSkill2() : coach.getSkill2(),
    },
    skill3: {
      type: SkillType,
      resolve: (coach: any) =>
        coach.node ? coach.node.getSkill3() : coach.getSkill3(),
    },
    skill4: {
      type: SkillType,
      resolve: (coach: any) =>
        coach.node ? coach.node.getSkill4() : coach.getSkill4(),
    },
    class: {
      type: GraphQLString,
      resolve: (coach: any) => (coach.node ? coach.node.class : coach.class),
    },
    gender: {
      type: GraphQLString,
      resolve: (coach: any) => (coach.node ? coach.node.gender : coach.gender),
    },
    rating: {
      type: GraphQLFloat,
      resolve: (coach: any) =>
        Math.round(coach.node ? coach.node.rating : coach.rating),
    },
    height: {
      type: GraphQLString,
      resolve: (coach: any) => (coach.node ? coach.node.height : coach.height),
    },
    weight: {
      type: GraphQLString,
      resolve: (coach: any) => (coach.node ? coach.node.weight : coach.weight),
    },
    hometown: {
      type: GraphQLString,
      resolve: (coach: any) =>
        coach.node ? coach.node.hometown : coach.hometown,
    },
    profileImage: {
      type: MediaType,
      resolve: (coach: any) =>
        coach.node ? coach.node.getProfileImage() : coach.getProfileImage(),
    },
    bannerImage: {
      type: MediaType,
      resolve: (coach: any) =>
        coach.node ? coach.node.getBannerImage() : coach.getBannerImage(),
    },
    bio: {
      type: GraphQLString,
      resolve: (coach: any) => (coach.node ? coach.node.bio : coach.bio),
    },
    eventCount: {
      type: GraphQLInt,
      resolve: (coach: any) =>
        coach.node ? coach.node.getEventCount() : coach.getEventCount(),
    },
    cellphone: {
      type: GraphQLString,
      resolve: (coach: any) =>
        coach.node ? coach.node.cellphone : coach.cellphone,
    },
    isPhoneVerified: {
      type: GraphQLBoolean,
      resolve: (coach: any) =>
        coach.node ? coach.node.isPhoneVerified : coach.isPhoneVerified,
    },
    updatedAt: {
      type: GraphQLString,
      resolve: (coach: any) =>
        coach.node ? coach.node.updatedAt : coach.updatedAt,
    },
    path: {
      type: GraphQLString,
      resolve: (coach: any) => (coach.node ? coach.node.path : coach.path),
    },
    disabledBooking: {
      type: GraphQLBoolean,
      resolve: (coach: any) =>
        coach.node ? coach.node.disabledBooking : coach.disabledBooking,
    },
  }),
});

const CoachEdgeType = new GraphQLObjectType({
  name: 'CoachEdge',
  fields: () => ({
    node: { type: CoachType, resolve: (coach: any) => coach },
  }),
});

const CoachConnectionType = new GraphQLObjectType({
  name: 'CoachConnection',
  fields: () => ({
    edges: { type: new GraphQLList(CoachEdgeType) },
    total: { type: GraphQLInt },
  }),
});

export { CoachType, CoachEdgeType, CoachConnectionType };
export default { CoachType, CoachEdgeType, CoachConnectionType };
