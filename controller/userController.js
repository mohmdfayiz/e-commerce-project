const userHelpers = require("../helpers/user-helpers");
const nodemailer = require("nodemailer");
const { response } = require("express");

// SESSION MIDDLEWARE FOR CART, WISHLIST, AND ACCOUNT
exports.userSession = (req, res, next) => {
  if (req.session.userLogin) {
    next()
  } else {
    res.redirect('/login');
  }
};

// MIDDLEWARE FOR CHECKING USER IS ACTIVE OR NOT
exports.userStatus = (req, res, next) => {
  let userId = req.session.user._id
  userHelpers.userStatus(userId).then((userStatus) => {
    if (userStatus === "Active") {
      next()
    } else {
      req.session.destroy();
      res.redirect("/");
    }
  })
}

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

// OTP PAGE
exports.email_vairification = (req, res) => {
  let status = req.session.resend;
  let otpErr = req.session.otpErr;
  res.render('userViews/otp', { email, status, otpErr })
}

// OTP 
var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
var email;
var userData;

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: 'Gmail',

  auth: {
    user: 'rideauthentication@gmail.com',
    pass: 'ztksvhjupmgmjcwz',
  }
});

// DO_SIGNUP
exports.doSignup = async (req, res) => {

  req.session.exist = false;
  req.session.otpErr = false;
  req.session.resend = false;
  userData = req.body;

  userHelpers.doSignup(userData).then((result) => {
    if (result) {

      res.redirect('/email_varification');
      email = userData.email;
      // send mail with defined transport object
      var mailOptions = {
        to: email,
        subject: "Otp for registration: ",
        html: "<h3>OTP for account verification is </h3>" +
          "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      });
    } else {
      req.session.exist = true;
      res.redirect('/signup')
    }
  })
};

// RESEND OTP
exports.resendOtp = (req, res) => {
  var mailOptions = {
    to: email,
    subject: "Otp for registration is: ",
    html: "<h3>OTP for account verification is </h3>" +
      "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    req.session.resend = true;
    res.redirect('/email_varification');
  });
}

// OTP VARIFICATION
exports.varifyOtp = (req, res) => {
  if (req.body.otp == otp) {
    userHelpers.user_proceed(userData).then((result) => {
      userData = null;
      console.log(userData +"---------user data");
      req.session.userLogin = true
      req.session.user = result.newUser // user data
      res.redirect('/');
    })
  }
  else {
    // incorrect otp
    req.session.otpErr = true;
    res.redirect('/email_varification');
  }
}

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
    if (list) {
      res.render('userViews/wishlist-page', { login: true, list })
    } else {
      res.render('userViews/wishlist-page', { login: true, list: [] })

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
exports.removeWishlistItem = async (req, res) => {
  let productId = req.params.id
  let userId = req.session.user._id
  userHelpers.removeWishlistItem(userId, productId).then(() => {
    res.redirect('/wishlist')
  })

}

// VIEW CART
exports.cart = async (req, res) => {
  let userId = req.session.user._id
  userHelpers.cart_items(userId).then((products) => {
    if (products) {
      res.render('userViews/shoping-cart', { login: true, products })
    } else {
      res.render('userViews/shoping-cart', { login: true, products: [] })
    }
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

// REMOVE CART ITEM
exports.removeCartItem = (req, res) => {
  let userId = req.session.user._id
  let productId = req.params.productId
  userHelpers.removeCartItem(userId, productId).then(() => {
    res.redirect('/cart')
  })
}

// ADD TO CART FROM WISHLIST
exports.moveToCart = (req, res) => {
  let userId = req.session.user._id
  let productId = req.params.productId

  userHelpers.moveToCart(userId, productId).then(() => {
    res.redirect('/wishlist')
  })
}
