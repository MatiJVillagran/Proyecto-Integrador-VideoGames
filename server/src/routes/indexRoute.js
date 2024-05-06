const allVideogames= require("../controllers/allVideogames");
const videogameById= require("../controllers/videogameById");
const videogameByName= require("../controllers/videogameByName");
const postVideogame= require ("../controllers/postVideogame");
const allGenres= require ("../controllers/allGenres");
const express= require ("express");


const router= express.Router();
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');




// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get("/videogames", allVideogames);
router.get("/videogames/name", videogameByName);
router.get("/videogames/:idVideogame",videogameById);
router.post("/videogames", postVideogame);
router.get("/genres", allGenres);


module.exports = router;