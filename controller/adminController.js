const bcrypt = require("bcrypt");
const session = require("express-session");
const userModel = require("../model/signupModel");

exports.login = (req, res) => {
  if (req.session.adminLogin) {
    res.redirect("/admin/dashboard");
  } else {
    res.render("adminViews/adminLogin", { loginErr: req.session.loginErr, passwordErr:req.session.passwordErr});
  }
};
exports.adminHome = (req, res) => {
  if (req.session.adminLogin) {
    res.render("adminViews/index");
  } else {
    res.redirect("/admin");
  }
};

//  ADMIN_LOGIN
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({
    $and: [{ email: email }, { type: "admin" }],
  });

  req.session.loginErr = false;
  req.session.passwordErr = false;

  if (!user) {
    console.log("invalid email");
    req.session.loginErr = true;
    res.redirect("/admin");
  } else {
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      req.session.adminLogin = true;
      res.redirect("/admin/dashboard");
    } else {
      req.session.passwordErr = true
      console.log("incorrect password");
      res.redirect("/admin");
    }
  }
};

// LOGOUT
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/admin");
};

exports.allProducts = (req,res)=>{
  res.render('adminViews/products')
}