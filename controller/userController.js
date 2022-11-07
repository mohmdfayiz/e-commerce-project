const userHelpers = require("../helpers/user-helpers");
const { response } = require("express");

// SESSION MIDDLEWARE FOR CART, WISHLIST, AND ACCOUNT
exports.userSession = (req, res, next) => {
  if (req.session.userLogin) {
    next()
  } else {
    res.redirect('/login');
  }
};

// User Home Page
exports.home = async (req, res) => {

  userHelpers.getProducts().then((products) => {
    if (req.session.userLogin) {
      res.render("userViews/index", { products, login: true })
    } else {
      res.render("userViews/index", { products, login: false });
    }
  })
};

// User Login page
exports.login = (req, res) => {
  if (req.session.userLogin) {
    res.redirect("/");
  } else {
    res.render("userViews/userLogin", { loginErr: req.session.loginErr, passwordErr: req.session.passwordErr });
  }
};

// User Signup page
exports.signup = (req, res) => {
  if (req.session.userLogin) {
    res.redirect("/");
  } else {
    res.render("userViews/signup", { emailExist: req.session.exist });
  }
};

// DO_SIGNUP
exports.doSignup = async (req, res) => {
  req.session.exist = false;

  userHelpers.doSignup(req.body).then((result) => {
    if (result) {
      req.session.userLogin = true
      res.redirect('/')
    } else {
      req.session.exist = true
      res.redirect('/signup')
    }
  })
};

// DO_LOGIN
exports.doLogin = async (req, res) => {

  req.session.loginErr = false;
  req.session.passwordErr = false;

  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.userLogin = true
      res.redirect('/')
    } else if (response.passwordErr) {
      req.session.passwordErr = true
      res.redirect('/login')
    } else {
      req.session.loginErr = true
      res.redirect('/login')
    }
  })
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

// VIEW CART
exports.cart = (req, res) => {
  res.render('userViews/shoping-cart', { login: true })
}

//  USER ACCOUNT
exports.account = (req, res) => {
  res.render('userViews/err')
}

// PRODUCT DETAILS
exports.product_details = async (req, res) => {
  userHelpers.product_details(req.params.id).then((details) => {
    const { product, related_products } = details
    if (req.session.userLogin) {
      res.render('userViews/product-detail', { product, related_products, login: true })
    } else {
      res.render('userViews/product-detail', { product, related_products, login: false })
    }
  })
}