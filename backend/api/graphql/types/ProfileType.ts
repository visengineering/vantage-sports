import { SportType } from './SportType';
import { SkillType } from './SkillType';
import { UniversityType } from './UniversityType';
import { MediaType } from './MediaType';
import { PositionType } from './PositionType';

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
} = require('graphql');

import { UserType } from './UserType';

const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  description: 'This represents a Profile',
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve: (profile: any) => (profile.node ? profile.node.id : profile.id),
    },
    user: {
      type: UserType,
      resolve: (profile: any) =>
        profile.node ? profile.node.getUser() : profile.getUser(),
    },
    userId: {
      type: GraphQLInt,
      resolve: (profile: any) =>
        profile.node ? profile.node.userId : profile.userId,
    },
    name: {
      type: GraphQLString,
      resolve: (profile: any) =>
        profile.node ? profile.node.name : profile.name,
    },
    userType: {
      type: GraphQLInt,
      resolve: (profile: any) =>
        profile.node ? profile.node.userType : profile.userType,
    },
    sport: {
      type: SportType,
      resolve: (profile: any) =>
        profile.node ? profile.node.getSport() : profile.getSport(),
    },
    university: {
      type: UniversityType,
      resolve: (profile: any) =>
        profile.node ? profile.node.getUniversity() : profile.getUniversity(),
    },
    city: {
      type: GraphQLString,
      resolve: (profile: any) =>
        profile.node ? profile.node.city : profile.city,
    },
    state: {
      type: GraphQLString,
      resolve: (profile: any) =>
        profile.node ? profile.node.state : profile.state,
    },
    zip: {
      type: GraphQLString,
      resolve: (profile: any) =>
        profile.node ? profile.node.zip : profile.zip,
    },
    primaryPosition: {
      type: PositionType,
      resolve: (profile: any) =>
        profile.node
          ? profile.node.getPrimaryPosition()
          : profile.getPrimaryPosition(),
    },
    secondaryPosition: {
      type: PositionType,
      resolve: (profile: any) =>
        profile.node
          ? profile.node.getSecondaryPosition()
          : profile.getSecondaryPosition(),
    },
    skill: {
      type: GraphQLString,
      resolve: (profile: any) =>
        profile.node ? profile.node.skill : profile.skill,
    },
    skill1: {
      type: SkillType,
      resolve: (profile: any) =>
        profile.node ? profile.node.getSkill1() : profile.getSkill1(),
    },
    skill2: {
      type: SkillType,
      resolve: (profile: any) =>
        profile.node ? profile.node.getSkill2() : profile.getSkill2(),
    },
    skill3: {
      type: SkillType,
      resolve: (profile: any) =>
        profile.node ? profile.node.getSkill3() : profile.getSkill3(),
    },
    skill4: {
      type: SkillType,
      resolve: (profile: any) =>
        profile.node ? profile.node.getSkill4() : profile.getSkill4(),
    },
    class: {
      type: GraphQLString,
      resolve: (profile: any) =>
        profile.node ? profile.node.class : profile.class,
    },
    gender: {
      type: GraphQLString,
      resolve: (profile: any) =>
        profile.node ? profile.node.gender : profile.gender,
    },
    rating: {
      type: GraphQLFloat,
      resolve: (profile: any) =>
        Math.round(profile.node ? profile.node.rating : profile.rating),
    },
    height: {
      type: GraphQLString,
      resolve: (profile: any) =>
        profile.node ? profile.node.height : profile.height,
    },
    weight: {
      type: GraphQLString,
      resolve: (profile: any) =>
        profile.node ? profile.node.weight : profile.weight,
    },
    hometown: {
      type: GraphQLString,
      resolve: (profile: any) =>
        profile.node ? profile.node.hometown : profile.hometown,
    },
    profileImage: {
      type: MediaType,
      resolve: (profile: any) =>
        profile.node
          ? profile.node.getProfileImage()
          : profile.getProfileImage(),
    },
    bannerImage: {
      type: MediaType,
      resolve: (profile: any) =>
        profile.node ? profile.node.getBannerImage() : profile.getBannerImage(),
    },
    bio: {
      type: GraphQLString,
      resolve: (profile: any) =>
        profile.node ? profile.node.bio : profile.bio,
    },
    eventCount: {
      type: GraphQLInt,
      resolve: (profile: any) =>
        profile.node ? profile.node.getEventCount() : profile.getEventCount(),
    },
    cellphone: {
      type: GraphQLString,
      resolve: (profile: any) =>
        profile.node ? profile.node.cellphone : profile.cellphone,
    },
    isPhoneVerified: {
      type: GraphQLBoolean,
      resolve: (profile: any) =>
        profile.node ? profile.node.isPhoneVerified : profile.isPhoneVerified,
    },
    updatedAt: {
      type: GraphQLString,
      resolve: (profile: any) =>
        profile.node ? profile.node.updatedAt : profile.updatedAt,
    },
    path: {
      type: GraphQLString,
      resolve: (profile: any) =>
        profile.node ? profile.node.path : profile.path,
    },
    disabledBooking: {
      type: GraphQLBoolean,
      resolve: (profile: any) =>
        profile.node ? profile.node.disabledBooking : profile.disabledBooking,
    },
  }),
});

export { ProfileType };
export default { ProfileType };
