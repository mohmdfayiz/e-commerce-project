const userModel = require("../model/signupModel");
const bcrypt = require("bcrypt");

exports.home = (req, res) => res.render("userViews/home");
exports.login = (req, res) => res.render("userViews/userLogin");
exports.signup = (req, res) => res.render("userViews/signup");

// doSignup
exports.doSignup = (req, res) => {
  const newUser = new userModel({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser
        .save()
        .then(() => {
          res.redirect("/");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/signup");
        });
    });
  });
};

// doLogin
exports.doLogin = (req, res) => {
  const useremail = req.body.email;
  const password = req.body.password;

  User.findOne({ $and: [{email: useremail}, {type:'user'}]},(err, foundUser) => {
    if (err) console.log(err);
    if (!foundUser) {
      res.redirect("/login");
    } else {
      bcrypt.compare(password, foundUser.password , (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          res.redirect("/");
        } else {
          res.redirect("/login");
        }
      });
    }
  });
};
