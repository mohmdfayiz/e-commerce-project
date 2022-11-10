const userHelpers = require("../helpers/user-helpers");
const { response } = require("express");
const categoryModel = require("../model/categoryModel");

// SESSION MIDDLEWARE FOR CART, WISHLIST, AND ACCOUNT
exports.userSession = (req, res, next) => {
  if (req.session.userLogin) {
    next()
  } else {
    res.redirect('/login');
  }
};

// USER HOME PAGE
exports.home = async (req, res) => {
  userHelpers.getProducts().then((products) => {
    if (req.session.userLogin) {
      res.render("userViews/index", { products, login: true })
    } else {
      res.render("userViews/index", { products, login: false });
    }
  })
};

// USER LOGIN PAGE
exports.login = (req, res) => {
  if (req.session.userLogin) {
    res.redirect("/");
  } else {
    res.render("userViews/userLogin", { loginErr: req.session.loginErr, passwordErr: req.session.passwordErr });
  }
};

// USER SIGN UP PAGE
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
    if (result.user) {
      req.session.userLogin = true
      req.session.user = result.newUser // user data
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
      req.session.user = response.user // user data
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

// LOGOUT
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};


// USER ACCOUNT
exports.account = (req, res) => {
  res.redirect('/') // not ready
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
  console.log(req.session.userId);
}

// VIEW WISHLIST
exports.wishlist = (req, res) => {
  let userId = req.session.user._id
  userHelpers.wishlist_items(userId).then((list) => {
    if(list){
    res.render('userViews/wishlist-page', { login: true, list })
    }else{
    res.render('userViews/wishlist-page', { login: true, list:[null] })

    }
  })
}

// ADD TO WISHLIST
exports.addToWishlist = async (req, res) => {
  let productId = req.params.productId
  let userId = req.session.user._id    //user id
  userHelpers.addto_wishlist(userId, productId).then(() => {
    res.redirect('/')
  })
}

// REMOVE ITEM FROM WISHLIST
exports.removeWishlistItem = async(req,res) =>{
  let productId = req.params.id
  let userId = req.session.user._id
  userHelpers.removeWishlistItem(userId,productId).then(()=>{
    res.redirect('/wishlist')
  })
  
}

// VIEW CART
exports.cart = async (req, res) => {
  let userId = req.session.user._id
  userHelpers.cart_items(userId).then((product) => {
    res.render('userViews/shoping-cart', { login: true, product })
  })
}

// ADD TO CART
exports.addToCart = (req, res) => {

  let userId = req.session.user._id
  let productId = req.params.productId
  let quantity = req.body.quantity

  userHelpers.addto_cart(userId, productId, quantity).then(() => {
    res.redirect('/product_details/' + productId)
  })
}