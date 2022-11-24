const session = require("express-session");
const { isObjectIdOrHexString } = require("mongoose");
const { populate } = require("../model/productModel");
const adminHelpers = require('../helpers/admin-helpers');
const { response } = require("express");
const moment = require("moment");

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
  req.session.adminLogin ? res.render("adminViews/index") : res.redirect("/admin")
};

// CHANGE PASSWORD PAGE
// exports.changePassword = (req,res) => {
//   res.render("adminViews/change-password")
// }

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
  adminHelpers.subcategories().then((categories) => {
    res.render("adminViews/addProduct", { categories });
  })
};

// NEW PRODUCT
exports.newProduct = async (req, res) => {

  let data = req.body

  req.files.forEach(img => { });
  console.log(req.files);
  const productImages = req.files != null ? req.files.map((img) => img.path) : null
  console.log(productImages);

  adminHelpers.newProduct(data, productImages).then(() => {
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
  const productImages = req.files.length != 0 ? req.files.map((img) => img.path) : null
  adminHelpers.editProductDetails(req.params.id, req.body, productImages).then(() => {
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

// UNDO DELETE PRODUCT
exports.undoDeleteProduct = (req, res) => {
  let id = req.params.id;
  adminHelpers.restoreProduct(id).then(() => {
    res.redirect("/admin/deletedProducts");
  })
};

// CATEGORIES 
exports.categories = (req, res) => {
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
exports.deleteCategory = (req, res) => {
  let id = req.params.id;
  adminHelpers.deleteCategory(id).then(() => {
    res.redirect("/admin/categories");
  })
};

// RESTORE CATOGORY
exports.restoreCategory = (req, res)=>{
  adminHelpers.restoreCategory(req.params.id).then(()=>{
    res.redirect('/admin/categories')
  })
}

// SUBCATEGORIES
exports.subcategories = (req, res) => {
  adminHelpers.getSubcategories().then((result) => {
    const {categories, subcategories} = result
    res.render("adminViews/subcategories", { categories, subcategories })
  })
}

// NEW SUBCATEGORY
exports.addSubcatergory = (req, res) => {
  adminHelpers.addSubcategory(req.body).then(() => {
    res.redirect('/admin/subcategories')
  })
}

// DELETE SUBCATEGORY
exports.deleteSubcategory = (req, res) =>{
  adminHelpers.deleteSubcategories(req.params.id).then(()=>{
    res.redirect('/admin/subcategories')
  })
}

// RESTORE SUBCATEGORIES
exports.restoreSubcategory = (req,res) =>{
  adminHelpers.restoreSubcategory(req.params.id).then(()=>{
    res.redirect('/admin/subcategories')
  })
} 

// COUPONS PAGE
exports.coupons = (req,res) =>{
  res.render('adminViews/coupon')
}

// ORDERS
exports.orders = (req, res) => {
  adminHelpers.orders().then((orders)=>{
    res.render("adminViews/orders",{orders,moment})
  })
};

// ORDER DETAILS PAGE
exports.orderDetails = (req,res) =>{
  let orderId = req.params.orderId
  adminHelpers.orderDetails(orderId).then((order)=>{
    res.render("adminViews/orderDetails",{order,moment})
  })
}

// CHANGE ORDER DETAILS
exports.changeOrderStatus = (req,res) =>{
  let orderId = req.body.orderId
  let status = req.body.status
  adminHelpers.changeOrderStatus(orderId,status).then(()=>{
    res.json({response:true})
  })
}
