const session = require("express-session");
const { isObjectIdOrHexString } = require("mongoose");
const { populate } = require("../model/productModel");
const adminHelpers = require('../helpers/admin-helpers');
const { response } = require("express");

// SESSION MIDDLEWARE
exports.adminSession = (req, res, next) => {
  if (req.session.adminLogin) {
    next();
  } else {
    res.redirect("/admin");
  }
};

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

  req.session.loginErr = false;
  req.session.passwordErr = false;

  adminHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.adminLogin = true
      res.redirect('/admin/dashboard')
    } else if (response.passwordErr) {
      req.session.passwordErr = true
      res.redirect('/admin')
    } else {
      req.session.loginErr = true
      res.redirect('/admin')
    }
  })
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

// ALL USERS
exports.allUsers = async (req, res) => {
  adminHelpers.getUsers().then((users) => {
    res.render("adminViews/allUsers", { users, index: 1 });
  })
};

// BLOCK USER
exports.blockUser = async (req, res) => {
  adminHelpers.blockUser(req.params.id).then(() => {
    res.redirect("/admin/allUsers");
  })
};

// UNBLOCK USER
exports.unblockUser = async (req, res) => {
  adminHelpers.unblockUser(req.params.id).then(() => {
    res.redirect("/admin/allUsers");
  });
};

// VIEW ALL PRODUCTS
exports.allProducts = async (req, res) => {
  adminHelpers.getProducts().then((products) => {
    res.render("adminViews/products", { products });
  })
};

// ADD PRODUCT FORM
exports.addProduct = async (req, res) => {
  adminHelpers.getCategories().then((categories) => {
    res.render("adminViews/addProduct", { categories });
  })
};

// NEW PRODUCT
exports.newProduct = async (req, res) => {

  let data = req.body
  let img = req.file

  adminHelpers.newProduct(data, img).then((product) => {
    res.redirect("/admin/addProduct");
  })
};

// EDIT PRODUCT PAGE
exports.editProduct = async (req, res) => {
  adminHelpers.editProduct(req.params.id).then((result) => {
    const { product, categories } = result
    res.render("adminViews/editProduct", { product, categories });
  })
};

// EDIT PRODUCT
exports.editDetails = async (req, res) => {
  adminHelpers.editProductDetails(req.params.id, req.body, req.file).then((result) => {
    res.redirect('/admin/allProducts')
  })
};

//  DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  adminHelpers.deleteProduct(req.params.id).then(() => {
    res.redirect("/admin/allProducts");
  })
};

// DELETED PRODUCTS PAGE
exports.deletedProducts = async (req, res) => {
  adminHelpers.deletedProducts().then((product) => {
    res.render("adminViews/deletedProducts", { product });
  })
};

// UNDO DELETE
exports.undoDeleteProduct = async (req, res) => {
  let id = req.params.id;
  adminHelpers.restoreProduct(id).then(() => {
    res.redirect("/admin/deletedProducts");
  })
};

// CATEGORIES 
exports.categories = async (req, res) => {
  adminHelpers.getCategories().then((categories) => {
    res.render("adminViews/categories", { categories });
  })
};

// NEW CATEGORY
exports.addCatergory = (req, res) => {
  const category = req.body.category;
  adminHelpers.addCatergory(category).then(() => {
    res.redirect("/admin/categories")
  })
};

// DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
  let id = req.params.id;
  adminHelpers.deleteCategory(id).then(() => {
    res.redirect("/admin/categories");
  })
};

// ORDERS
exports.orders = (req, res) => {
  res.render("adminViews/orders");
};
