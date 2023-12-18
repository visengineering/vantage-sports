import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasOneCreateAssociationMixin,
  Association,
} from 'sequelize';
import db from '../../config/database';
import { Event } from './Event';
import { Profile } from './Profile';

export const GeoAddressTableName = 'geo_addresses';
const modelName = GeoAddressTableName;

export type GeoAddressDBType = {
  streetNumber: string | undefined;
  route: string | undefined;
  area: string | undefined;
  city: string | undefined;
  region: string | undefined;
  state: string | undefined;
  postalCode: string | undefined;
  country: string | undefined;
  formattedAddress: string | undefined;
  placeId: string | undefined;
  name: string | undefined;
  geometryLocationLat: number | undefined;
  geometryLocationLng: number | undefined;
};

export class GeoAddress extends Model<
  InferAttributes<GeoAddress>,
  InferCreationAttributes<GeoAddress>
> {
  declare id: CreationOptional<number>;

  declare streetNumber: CreationOptional<string>;
  declare route: CreationOptional<string>;
  declare area: CreationOptional<string>;
  declare city: CreationOptional<string>;
  declare region: CreationOptional<string>;
  declare state: CreationOptional<string>;
  declare postalCode: CreationOptional<string>;
  declare country: CreationOptional<string>;

  declare formattedAddress: CreationOptional<string>;
  declare placeId: CreationOptional<string>;
  declare name: CreationOptional<string>;

  declare geometryLocationLat: CreationOptional<number>;
  declare geometryLocationLng: CreationOptional<number>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare associate: (models: Model<any>) => void;

  declare event?: NonAttribute<Event>;

  declare getEvent: HasOneGetAssociationMixin<Event>;
  declare setEvent: HasOneSetAssociationMixin<Event, number>;
  declare createEvent: HasOneCreateAssociationMixin<Event>;

  declare profile?: NonAttribute<Profile>;

  declare getProfile: HasOneGetAssociationMixin<Profile>;
  declare setProfile: HasOneSetAssociationMixin<Profile, number>;
  declare createProfile: HasOneCreateAssociationMixin<Profile>;

  declare static associations: {
    event: Association<GeoAddress, Event>;
    profile: Association<GeoAddress, Profile>;
  };
}

GeoAddress.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    streetNumber: { type: DataTypes.STRING },
    route: { type: DataTypes.STRING },
    area: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    region: { type: DataTypes.STRING },
    state: { type: DataTypes.STRING },
    postalCode: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },

    formattedAddress: { type: DataTypes.STRING },
    placeId: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },

    geometryLocationLat: {
      type: DataTypes.DECIMAL(8, 6),
      validate: { min: -90, max: 90 },
    },
    geometryLocationLng: {
      type: DataTypes.DECIMAL(9, 6),
      validate: { min: -180, max: 180 },
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: db,
    tableName: GeoAddressTableName,
    modelName: modelName,
  }
);

export default GeoAddress;
