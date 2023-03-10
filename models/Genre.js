import { Sequelize, Model, DataTypes } from 'sequelize';

import { pg_config } from "../config.js";

const { pg_host, pg_port, pg_database, pg_user, pg_password } = pg_config;

const sequelize = new Sequelize(`postgres://${pg_user}:${pg_password}@${pg_host}:${pg_port}/${pg_database}`);

export class Genre extends Model {}

Genre.init({
    // Model attributes are defined here
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
    // Other model options go here
    sequelize, // We need to pass the connection instance
    timestamps: false,
    underscored: true,
    modelName: 'Genre', // We need to choose the model name
    tableName: 'genre',
});
