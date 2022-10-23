const express = require('express');
const path = require('path');
const Mongoose = require('./configuration/connection')
// const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();



app.set('view engine','ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));

const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");

app.use('/admin',adminRouter);
app.use('/',userRouter);


app.listen('8080',()=>{
    console.log('server is running on http://localhost:8080')
})