const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('Videogame', {

    id:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    externalId:{
      type: DataTypes.INTEGER,
      allowNull:true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description:{
      type: DataTypes.TEXT,
      allowNull:false,
    },
    platforms:{ 
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull:false,
    },
    background_image:{
      type: DataTypes.STRING,
      allowNull:false,
      defaultValue:"https://img.freepik.com/vector-premium/fondo-estilo-luz-neon-icono-controlador-juego_680433-652.jpg?w=1060",
    },
    released: {
      type:DataTypes.STRING,
      allowNull:false,
    },
    rating: {
    type: DataTypes.FLOAT,
    allowNull:false,
    }
  }, { timestamps: false });
};
