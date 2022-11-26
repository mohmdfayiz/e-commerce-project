const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})

const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // userCreateIndex: true
})

mongoose.connection
.once("open",()=>console.log("data base connected successfully"))
.on("error",error =>{
    console.log("error:",error); 
})