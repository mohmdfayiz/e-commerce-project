const userModel = require("../model/signupModel");
const bcrypt = require("bcrypt");

// User Home Page
exports.home = (req, res) => {
  if (req.session.userLogin) {
    res.render("userViews/home", { login: true });
  } else {
    res.render("userViews/home", { login: false });
  }
};

// User Login page
exports.login = (req, res) => {
  if (req.session.userLogin) {
    res.redirect("/");
  } else {
    res.render("userViews/userLogin",{ loginErr: req.session.loginErr, passwordErr:req.session.passwordErr});
  }
};

// User Signup page
exports.signup = (req, res) => {
  if (req.session.userLogin) {
    res.redirect("/");
  } else {
    res.render("userViews/signup");
  }
};

// DO_SIGNUP
exports.doSignup = async (req, res) => {
  const { userName, email, password } = req.body;

  let user = await userModel.findOne({ email });
  if (user) {
    return res.redirect("/signup");
  }

  const hashpass = await bcrypt.hash(password, 10);
  const newUser = new userModel({
    userName,
    email,
    password: hashpass,
  });

  await newUser
    .save()
    .then(() => {
      req.session.userLogin = true;
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/signup");
    });
};

// DO_LOGIN
exports.doLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({
    $and: [{ email: email }, { type: "user" }],
  });

  req.session.loginErr = false;
  req.session.passwordErr = false;

  if (!user) {
    console.log("invalid email");
    req.session.loginErr = true;
    res.redirect("/login");
  } else {

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      req.session.userLogin = true;
      res.redirect("/");
    } else {
      req.session.passwordErr = true;
      console.log('invalid password');
      res.redirect("/login");
    }
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};
