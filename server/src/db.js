require('dotenv').config();
const { Sequelize } = require('sequelize');
const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;
const VideogameModel= require ("./models/Videogame");
const GenreModel= require ("./models/Genre");


const sequelize = new Sequelize(
   `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/videogames`,
   { logging: false, native: false }
);

VideogameModel (sequelize);
GenreModel (sequelize);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Videogame, Genre } = sequelize.models;

// Aca vendrian las relaciones
Videogame.belongsToMany(Genre, {through:"videogame_genre"});
Genre.belongsToMany(Videogame, {through:"videogame_genre"});

module.exports = {
   Videogame,
   Genre,
   conn: sequelize,
};
