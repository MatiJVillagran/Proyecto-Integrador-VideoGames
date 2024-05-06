const axios = require("axios");
const { Videogame, Genre } = require("../db");
const { API_KEY } = process.env;

const URL = "https://api.rawg.io/api/games";

async function allVideogames(req, res) {

  try {
    const responseBd = await Videogame.findAll({
      include: Genre,
      limit:100,
    });

    // Mapear cada juego y obtener los datos deseados
    const bdGames = responseBd.map((game) => {
      const gameData = game.toJSON(); // Convertir el objeto Sequelize a un objeto plano de JavaScript
      // Mapear los géneros asociados al juego y obtener solo el nombre de cada género
      const genres = gameData.Genres.map((genre) => genre.name);

      // Crear un nuevo objeto con los datos deseados del juego
      return {
        id: gameData.id,
        name: gameData.name,
        description: gameData.description,
        platforms: gameData.platforms,
        background_image: gameData.background_image,
        released: gameData.released,
        rating: gameData.rating,
        genres: genres,
      };
    });

    if (bdGames.length === 100) {
      return res.status(200).json(bdGames);
    }

    let pageSize = 20; // Tamaño de la página (número de resultados por página)
    let totalGames = 100 - bdGames.length; // Total de juegos que deseas obtener
    let totalPages = Math.ceil(totalGames / pageSize); // Calcula el número total de páginas

    let allGames = [];

    // Solicitudes sucesivas hasta alcanzar el límite deseado
    for (let page = 1; page <= totalPages; page++) {
      const response = await axios.get(
        `${URL}?key=${API_KEY}&page=${page}&page_size=${pageSize}&ordering=id`
      );
      // console.log(response.data);

      if (!response.data.results || response.data.results.length === 0) {
        // Si no hay más resultados, sal del bucle
        break;
      }
      // Utiliza map para mapear los datos de la API a tu modelo
      const mappedGames = response.data.results.map((game) => ({
        externalId: game.id,
        name: game.name,
        description: game.description,
        platforms: game.platforms.map((platform) => platform.platform.name),
        background_image: game.background_image,
        released: game.released,
        rating: game.rating,
        genres: game.genres.map((genre) => genre.name),
      }));

      allGames = [...allGames, ...mappedGames];
    }
    const finalGames = bdGames.length === 0 ? allGames : [...bdGames, ...allGames];
    
    res.status(200).json(finalGames.slice(0,100));
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

module.exports = allVideogames;
