const axios = require("axios");
const { Videogame, Genre } = require("../db");
const { API_KEY } = process.env;

const URL = "https://api.rawg.io/api/games";

async function videogameById(req, res) {
  const { idVideogame } = req.params;
  console.log(idVideogame);

  try {
    
    if (idVideogame && idVideogame.length >6){
    const response = await Videogame.findOne({
      where: { id: idVideogame }, include: Genre
    });
      
      const gameData = response.toJSON();
      console.log(gameData);
      const game = {
        id: gameData.id,
        name: gameData.name,
        description: gameData.description,
        platforms: gameData.platforms,
        background_image: gameData.background_image,
        released: gameData.released,
        rating: gameData.rating,
        genres: gameData.Genres.map((genre) => genre.name),
      };
      // console.log(game);
      return res.status(200).json(game);
    } else {

      const responseAPI = await axios.get(`${URL}/${idVideogame}?key=${API_KEY}`);

    
      if (responseAPI.data.name) {
        const gameData = responseAPI.data;

        const game = {
          externalId: gameData.id,
          name: gameData.name,
          description: gameData.description,
          platforms: gameData.platforms.map((platform) => platform.platform.name),
          background_image: gameData.background_image,
          released: gameData.released,
          rating: gameData.rating,
          genres: gameData.genres.map((genre) => genre.name),
        };
        // console.log(game);
         return res.status(200).json(game);
      } else {
        return res.status(404).send({ message: "Not Found!" });
      }
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

module.exports = videogameById;
