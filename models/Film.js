import { Sequelize, Model, DataTypes } from 'sequelize';

import { pg_config } from "../config.js";
import { Genre } from "./Genre.js";


const { pg_host, pg_port, pg_database, pg_user, pg_password } = pg_config;

const sequelize = new Sequelize(`postgres://${pg_user}:${pg_password}@${pg_host}:${pg_port}/${pg_database}`);

export class Film extends Model {}

Film.init({
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
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: 'Film',
    tableName: 'film',
});

Film.belongsToMany(Genre, { 
  through: 'film_genre', 
  foreignKey: {
    name: 'film_id',
    allowNull: false,
  },
  otherKey: 'genre_id',
  sourceKey: 'pk',
  onDelete: 'CASCADE',
});
