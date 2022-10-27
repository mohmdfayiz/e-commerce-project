const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/Ride')

mongoose.connection
.once("open",()=>console.log("data base connected successfully"))
.on("error",error =>{
    console.log("error:",error); 
})