import Sequelize, {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from '../../config/database';
import { Event } from './Event';
import { Profile } from './Profile';

export class Review extends Model<
  InferAttributes<Review>,
  InferCreationAttributes<Review>
> {
  declare id: CreationOptional<number>;
  declare coachProfileId: CreationOptional<number>;
  declare playerProfileId: CreationOptional<number>;
  declare eventId: CreationOptional<number>;
  declare comment: CreationOptional<string>;
  declare rating: CreationOptional<bigint>;
  declare createdAt: CreationOptional<string>;
  declare updatedAt: CreationOptional<string>;
}

Review.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    coachProfileId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: { tableName: 'profiles' }, key: 'id' },
    },
    playerProfileId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: { tableName: 'profiles' }, key: 'id' },
    },
    eventId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: { tableName: 'events' }, key: 'id' },
    },
    comment: { type: DataTypes.STRING, unique: false },
    rating: {
      type: Sequelize.FLOAT,
      validate: {
        max: 5,
        min: 1,
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize: db, tableName: 'reviews', modelName: 'review' }
);

/// Function to calculate average of coach ratings every time
async function calculateAverageRatings(review: Review) {
  const coachReview = await Review.findAll({
    where: { coachProfileId: review.coachProfileId },
    attributes: [
      'coachProfileId',
      [db.fn('AVG', db.col('rating')), 'average_rating'],
    ],
    group: ['coachProfileId'],
  });

  await Profile.update(
    {
      rating: parseInt(
        // TODO: Maybe access dataValues using official getter?
        // See: https://github.com/types/sequelize/blob/master/lib/model.d.ts
        parseFloat((coachReview[0] as any).dataValues.average_rating).toFixed(2)
      ),
    },
    { where: { id: review.coachProfileId } }
  );
}

Review.addHook('afterCreate', calculateAverageRatings);
Review.addHook('afterUpdate', calculateAverageRatings);

export default Review;
