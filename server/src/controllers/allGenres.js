const axios= require ("axios");
const {Videogame, Genre}= require("../db");
const { API_KEY } = process.env;

async function allGenres (req,res){

    const URL= "https://api.rawg.io/api/genres";

    try {

        let pageSize = 20; // Tamaño de la página (número de resultados por página)
        let allGenres = [];
        let page=1;
        
        while(true){
            const response= await axios.get(`${URL}?key=${API_KEY}&page=${page}&page_size=${pageSize}&ordering=id`);
            console.log(response);

            if (!response.data.results || response.data.results.length === 0) {
                // Si no hay más resultados, sal del bucle
                break;
              }

              const mappedGenres= response.data.results.map( (genre)=>({
                id:genre.id,
                name: genre.name,
              }))

               allGenres= [...allGenres, ...mappedGenres];

              if (!response.data.next) {
                // Si no hay más páginas, sal del bucle
                break;
            }
            page++;
            }
            const bdGenres= await Genre.bulkCreate(allGenres);

        return res.status(200).json(bdGenres);
    } catch (error) {
        res.status(500).send({ message: error.message }); 
    }
}

module.exports= allGenres;