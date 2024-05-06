const axios = require("axios");
const { Videogame, Genre } = require("../db");
const { API_KEY } = process.env;

async function postVideogame(req,res){
    
    try {
    
        const {name, description, platforms, background_image, released, rating, genre}=req.body;
        console.log(req.body);
      
            if (!name || !description || !platforms || !released || !rating || !genre)
             return res.status(401).json ({error:"Faltan datos"});
            
            const [game, gameCreated]= await Videogame.findOrCreate({
              where: {name},
              defaults: { name, description, platforms, background_image, released, rating,}
            })
            
            if (!gameCreated)
            return res.status(400).json({error:"Videojuego ya existente"});

            if (genre && genre.length > 0) {
                await game.addGenres(genre);
            }    
        console.log(game);
        return res.status(200).json({message:"Videojuego creado"});
        
        
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

module.exports= postVideogame;