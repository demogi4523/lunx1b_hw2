import { Sequelize, Model, DataTypes } from 'sequelize';

import { pg_config } from "../config.js";
import { Film } from './Film.js';
import { Genre } from './Genre.js';

const { pg_host, pg_port, pg_database, pg_user, pg_password } = pg_config;

const sequelize = new Sequelize(`postgres://${pg_user}:${pg_password}@${pg_host}:${pg_port}/${pg_database}`);

export class Film_Genre extends Model {}

Film_Genre.init({
  film_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Film,
      key: 'pk',
    },
  },
  genre_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    //  TODO: add support
    // onDelete:
    // onUpdate
    references: {
      model: Genre,
      key: 'pk',
    }
  },
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    timestamps: false,
    underscored: true,
    modelName: 'Film_Genre', // We need to choose the model name
    tableName: 'film_genre',
});
