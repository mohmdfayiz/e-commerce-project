const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const Mongoose = require("./configuration/connection");

const app = express();

app.use((req, res, next) => {
  res.header("Cache-Control", "private,no-cache,no-store,must-revalidate");
  next();
});

//view engine
app.set("view engine", "ejs");

//static files
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({ extended: false }));

//session and cookied
app.use(cookieParser());
const DAY = 1000*60*60*24;
app.use(
  session({
    secret: "Your_Secret_Key",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: DAY },
  })
);

const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");

// MAIN ROUTES
app.use("/admin", adminRouter);
app.use("/", userRouter);

app.listen("8080", () => {
  console.log("server is running on http://localhost:8080");
});
