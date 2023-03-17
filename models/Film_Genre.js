import { Sequelize, Model, DataTypes } from 'sequelize';

import { pg_config } from "../config.js";


const { pg_host, pg_port, pg_database, pg_user, pg_password } = pg_config;

const sequelize = new Sequelize(`postgres://${pg_user}:${pg_password}@${pg_host}:${pg_port}/${pg_database}`);

export class Film_Genre extends Model {}

Film_Genre.init({
  pk: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  film_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  genre_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  }, {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: 'Film_Genre',
    tableName: 'film_genre',
});

(async () => {
  try {
    await sequelize.queryInterface.addConstraint('film_genre', {
      fields: ['film_id', 'genre_id'],
      type: 'unique',
      name: 'unique_composite_film_genre',
    });
  } catch (err) {
    // console.log(err);
  }
})();
