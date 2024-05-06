const server= require("./app");
const PORT= 3001;
const { conn } = require('./db');

conn.sync({force:true}).then(()=>{
    console.log("Database connected");
    server.listen(PORT, ()=>{
        console.log( "Server raise in port: " +PORT);})
})
