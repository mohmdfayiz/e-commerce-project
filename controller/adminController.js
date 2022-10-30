const bcrypt = require("bcrypt");
const session = require("express-session");
const userModel = require("../model/userModel");
const productModel = require("../model/productModel");
const { isObjectIdOrHexString } = require("mongoose");

// ADMIN LOGIN PAGE
exports.login = (req, res) => {
  if (req.session.adminLogin) {
    res.redirect("/admin/dashboard");
  } else {
    res.render("adminViews/adminLogin", {
      loginErr: req.session.loginErr,
      passwordErr: req.session.passwordErr,
    });
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
      req.session.passwordErr = true;
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

// ADMIN HOME PAGE
exports.adminHome = (req, res) => {
  if (req.session.adminLogin) {
    res.render("adminViews/index");
  } else {
    res.redirect("/admin");
  }
};

// VIEW ALL PRODUCTS
exports.allProducts = async (req, res) => {
  let product = await productModel.find({});
  res.render("adminViews/products", { product });
};

// ADD PRODUCT
exports.addProduct = (req, res) => {
  res.render("adminViews/addProduct");
};

// NEW PRODUCT
exports.newProduct = async (req, res) => {
  const { category, productName, description, price, quantity } = req.body;
 
  const image = req.file;
  console.log(image)

  const newProduct = productModel({
    category,
    productName,
    description,
    price,
    quantity,
    imageUrl:image.path
  });

  await newProduct
    .save()
    .then(() => {
      res.redirect("/admin/addProduct");
    })
    .catch((err) => {
      console.log(err.message);
      res.redirect("/admin/addProduct");
    });
};

// ALL USERS
exports.allUsers =async (req,res) =>{
  let users =await userModel.find({ type: { $not: { $eq: 'admin' } } });
  res.render('adminViews/allUsers',{users,index:1})
}

//  DELETE PRODUCT
// exports.delete =async (req,res) =>{
//   let id = req.params.id
//   await productModel.remove({id})
//   res.redirect('/admin/allProducts')
// }