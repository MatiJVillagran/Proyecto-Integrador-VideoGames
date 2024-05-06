const { DataTypes } = require('sequelize');

module.exports= (sequelize)=>{

    sequelize.define("Genre",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey: true,
            allownull: false,
            autoIncrement: true,
        },
        name:{
            type: DataTypes.STRING,
            allownull: false,
        }
    }, { timestamps: false })
}