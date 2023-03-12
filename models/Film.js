import { Sequelize, Model, DataTypes } from 'sequelize';

import { pg_config } from "../config.js";

const { pg_host, pg_port, pg_database, pg_user, pg_password } = pg_config;

const sequelize = new Sequelize(`postgres://${pg_user}:${pg_password}@${pg_host}:${pg_port}/${pg_database}`);

export class Film extends Model {}

Film.init({
    // Model attributes are defined here
    pk: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    production_year: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    timestamps: false,
    underscored: true,
    modelName: 'Film', // We need to choose the model name
    tableName: 'film',
});
