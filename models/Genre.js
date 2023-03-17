import { Sequelize, Model, DataTypes } from 'sequelize';

import { pg_config } from "../config.js";


const { pg_host, pg_port, pg_database, pg_user, pg_password } = pg_config;

const sequelize = new Sequelize(`postgres://${pg_user}:${pg_password}@${pg_host}:${pg_port}/${pg_database}`);

export class Genre extends Model {}

Genre.init({
    pk: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: 'Genre',
    tableName: 'genre',
});
