import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import db from '../../config/database';

const tableName = 'medias';

export class Media extends Model<
  InferAttributes<Media>,
  InferCreationAttributes<Media>
> {
  declare id: CreationOptional<number>;
  declare name: CreationOptional<string>;
  declare url: string;
  declare type: string;
  declare externalId: string;
  declare eventId: number;
  declare publicId: string;
  declare profileId: number;
  declare contentId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
Media.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    type: DataTypes.STRING,
    externalId: DataTypes.STRING,
    eventId: DataTypes.INTEGER,
    publicId: DataTypes.STRING,
    profileId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: { tableName: 'profiles' }, key: 'id' },
    },
    contentId: DataTypes.INTEGER,
    createdAt: { type: DataTypes.DATE(3), defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE(3), defaultValue: DataTypes.NOW },
  },
  {
    sequelize: db,
    tableName: tableName,
    modelName: 'Media',
  }
);

export default Media;
