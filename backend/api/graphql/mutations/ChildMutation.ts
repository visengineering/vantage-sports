import { GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import { Child } from '../../models';
import { ChildType } from '../types/ChildType';

export const deleteChild = {
  type: ChildType,
  description:
    'The mutation that allows you to remove an existing child by childId',
  args: {
    childId: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve: async (value: any, { childId }: { childId: number }) => {
    if (!(childId || childId === 0)) {
      throw new Error(`(#000063) Missing child id!`);
    }

    const child = await Child.findByPk(childId);

    if (!child) {
      throw new Error(
        `(#000064) Child with id: ${
          childId ?? '<<id_not_provided>>'
        } not found!`
      );
    }

    await child.destroy();

    return {};
  },
};

export const createChild = {
  type: ChildType,
  description: 'The mutation that allows you to add child',
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    remarks: { type: GraphQLString },

    parentProfileId: { type: new GraphQLNonNull(GraphQLInt) },
    favoriteSportId: { type: GraphQLInt },
    favoritePositionId: { type: GraphQLInt },
  },
  resolve: async (
    value: any,
    {
      name,
      parentProfileId,
      favoriteSportId,
      favoritePositionId,
      age,
      remarks,
    }: {
      name: string;
      parentProfileId: number;
      favoriteSportId: number;
      favoritePositionId: number;
      age: number;
      remarks: string;
    }
  ) => {
    if (!name || !(parentProfileId || parentProfileId === 0) || !age) {
      throw new Error(
        `(#000065) Missing essential child data for creation: ${JSON.stringify(
          {
            name,
            parentProfileId,
            favoriteSportId,
            favoritePositionId,
            age,
            remarks,
          },
          null,
          4
        )}`
      );
    }

    const created: Child = await Child.create({
      name,
      parentProfileId,
      favoriteSportId,
      favoritePositionId,
      age,
      remarks,
    });

    return created;
  },
};

export const updateChild = {
  type: ChildType,
  description: 'The mutation that allows you to update an existing child by Id',
  args: {
    childId: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    remarks: { type: GraphQLString },
    favoriteSportId: { type: GraphQLInt },
    favoritePositionId: { type: GraphQLInt },
  },
  resolve: async (
    _: any,
    args: {
      childId: number;
      age: number;
      name: string;
      remarks?: string;
      favoriteSportId?: number;
      favoritePositionId?: number;
    }
  ) => {
    const { childId, name, age, remarks, favoriteSportId, favoritePositionId } =
      args;

    if (!name || !age || !childId) {
      throw new Error(
        `(#000065) Missing essential child data for update: ${JSON.stringify(
          {
            childId,
            name,
            favoriteSportId,
            favoritePositionId,
            age,
            remarks,
          },
          null,
          4
        )}`
      );
    }

    if (age > 17 || age < 1) {
      return new Error('Age can only be between 1 and 17.');
    }

    const child = await Child.findByPk(childId);

    if (!child) {
      return new Error('Child not found. Please create a child first.');
    }

    child.name = name;
    child.age = age;
    child.remarks = remarks ? remarks : child.remarks;
    child.favoriteSportId = favoriteSportId ?? null;
    child.favoritePositionId = favoritePositionId ?? null;
    const updatedChild = await child.save();

    return updatedChild;
  },
};
