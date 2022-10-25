const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser')
const session = require('express-session');
const Mongoose = require('./configuration/connection');

const app = express();

//view engine
app.set('view engine','ejs');
//static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyparser.urlencoded({extended:false}))
//session and cookied
app.use(cookieParser());
app.use(session({ secret: 'Your_Secret_Key', resave: true, saveUninitialized: true, cookie:{maxAge: 120000}}))

const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");

app.use('/admin',adminRouter);
app.use('/',userRouter);

app.listen('8080',()=>{
    console.log('server is running on http://localhost:8080')
})