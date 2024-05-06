const axios = require("axios");
const { Videogame, Genre } = require("../db");
const { API_KEY } = process.env;
const { Op } = require("sequelize");

const URL = "https://api.rawg.io/api/games";

async function videogameByName(req, res) {
  let { name } = req.query;

  try {
    name = name.toLowerCase();
    const response = await Videogame.findAll({
      where: { name: { [Op.iLike]: `%${name}%` } },
      limit: 15,
      include: Genre,
    });

    // Mapear cada juego y obtener los datos deseados
    const bdGames = response.map((game) => {
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
    console.log(response);
    // let bdGames = response.map((game) => game.dataValues);

    if (bdGames.length === 15) {
      return res.status(200).json(bdGames);
    }

    let pageSize = 15 - bdGames.length; // (número de resultados por página)

    // Solicitudes sucesivas hasta alcanzar el límite deseado
    let page = 1;
    const responseApi = await axios.get(
      `${URL}?search=${name}&key=${API_KEY}&page=${page}&page_size=${pageSize}`
    );
    //  console.log(responseApi);
    // Utiliza map para mapear los datos de la API
    if (responseApi.data.results.length !== 0) {
      const mappedGames = responseApi.data.results.map((game) => ({
        externalId: game.id,
        name: game.name,
        description: game.description,
        platforms: game.platforms
          ? game.platforms.map((platform) => platform.platform.name)
          : [],
        background_image: game.background_image,
        released: game.released,
        rating: game.rating,
        genres: game.genres.map((genre) => genre.name),
      }));
      // console.log(mappedGames);

      let allGames = [...bdGames, ...mappedGames];
      console.log(bdGames);

      if (allGames.length === 0) {
        return res.status(202).json({ message: "Not found" });
      } else {
        return res.status(200).json(allGames);
      }
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

module.exports = videogameByName;
