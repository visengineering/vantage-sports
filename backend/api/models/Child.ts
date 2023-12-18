import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  BelongsTo,
  HasOneGetAssociationMixin,
  NonAttribute,
} from 'sequelize';
import db from '../../config/database';
import Profile from './Profile';
import Sport from './Sport';
import Position from './Position';

export const ChildTableName = 'children';

export class Child extends Model<
  InferAttributes<Child>,
  InferCreationAttributes<Child>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare age: number;
  declare parentProfileId: Profile['id'];
  declare favoriteSportId?: CreationOptional<Sport['id']> | null;
  declare favoritePositionId?: CreationOptional<Position['id']> | null;
  declare remarks?: CreationOptional<string> | null;
  declare createdAt: CreationOptional<string>;
  declare updatedAt: CreationOptional<string>;

  public static associations: {
    parent: BelongsTo<Child, Profile>;
  };

  declare parent: NonAttribute<Profile>;
  declare getParent: HasOneGetAssociationMixin<Profile>;
}

const ChildTableDefinition = {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, unique: false },
  parentProfileId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: false,
    references: { model: { tableName: 'profiles' }, key: 'id' },
  },
  favoriteSportId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: false,
    references: { model: Sport, key: 'id' },
  },
  favoritePositionId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: false,
    references: { model: Position, key: 'id' },
  },
  age: { type: DataTypes.INTEGER, unique: false, allowNull: false },
  remarks: { type: DataTypes.STRING, unique: false, allowNull: false },
  createdAt: { type: DataTypes.DATE(3), defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE(3), defaultValue: DataTypes.NOW },
};

Child.init(ChildTableDefinition, {
  sequelize: db,
  tableName: ChildTableName,
  modelName: 'Child',
});

export default Child;
