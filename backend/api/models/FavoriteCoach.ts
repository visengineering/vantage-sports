import { Profile as ProfileModel } from './Profile';
import {
  DataTypes,
  Model,
  BelongsTo,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import db from '../../config/database';
import { Participant } from './Participant';

export const FavoriteCoachTableName = 'favourite_coaches';
const modelName = FavoriteCoachTableName;

// Separate table to keep 3NF normal form for User
// Read more https://en.wikipedia.org/wiki/Third_normal_form
export class FavoriteCoach extends Model<
  InferAttributes<FavoriteCoach>,
  InferCreationAttributes<FavoriteCoach>
> {
  declare playerProfileId: number;
  declare coachProfileId: number;

  public readonly coach?: ProfileModel;
  public readonly player?: ProfileModel;

  public static associations: {
    coach: BelongsTo<FavoriteCoach, ProfileModel>;
    player: BelongsTo<FavoriteCoach, ProfileModel>;
  };

  public static async addEntryIfEligible({
    playerProfileId,
    coachProfileId,
  }: {
    playerProfileId: number;
    coachProfileId: number;
  }) {
    const alreadyExists = await FavoriteCoach.findOne({
      where: {
        playerProfileId,
        coachProfileId,
      },
    });

    if (alreadyExists) {
      return;
    }

    const playerProfile = await ProfileModel.findByPk(playerProfileId);

    if (!playerProfile) {
      return;
    }

    const allPurchasesOfCoachTraining = await Participant.findAll({
      where: {
        coachId: coachProfileId,
        clientId: playerProfile.userId,
        paid: true,
      },
    });

    if (!allPurchasesOfCoachTraining) {
      return;
    }
    if (allPurchasesOfCoachTraining.length < 2) {
      return;
    }

    await FavoriteCoach.create({
      playerProfileId,
      coachProfileId,
    });
  }
}

export const FavoriteCoachTableDefinition = {
  playerProfileId: {
    type: DataTypes.INTEGER,
    unique: false,
    references: { model: ProfileModel, key: 'id' },
  },
  coachProfileId: {
    type: DataTypes.INTEGER,
    unique: false,
    references: { model: ProfileModel, key: 'id' },
  },
};

FavoriteCoach.init(FavoriteCoachTableDefinition, {
  sequelize: db,
  tableName: FavoriteCoachTableName,
  modelName: modelName,
  freezeTableName: true,
  createdAt: false,
  updatedAt: false,
});
FavoriteCoach.removeAttribute('id');

export default FavoriteCoach;
