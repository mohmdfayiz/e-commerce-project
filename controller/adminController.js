const session = require("express-session");
const { isObjectIdOrHexString, trusted } = require("mongoose");
const { populate } = require("../model/productModel");
const adminHelpers = require('../helpers/admin-helpers');
const { response } = require("express");
const moment = require("moment");

// ADMIN LOGIN PAGE
exports.login = (req, res) => {
  if (req.session.adminLogin) {
    res.redirect("/admin/dashboard");
  } else {
      let loginErr = req.session.loginErr,passwordErr = req.session.passwordErr
      res.render("adminViews/adminLogin", {loginErr,passwordErr});
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
  adminHelpers.dashboardDetails().then((response)=>{
    let {allProducts,activeUsers,liveOrders,totalSales,onlinePayments, newOrders, newUsers, ordersToday} = response
    res.render("adminViews/index", {moment,allProducts,activeUsers,liveOrders,totalSales, onlinePayments, newOrders, newUsers, ordersToday});
  })
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
    res.json(true);
  })
};

// UNBLOCK USER
exports.unblockUser = async (req, res) => {
  adminHelpers.unblockUser(req.params.id).then(() => {
    res.json(true)
  });
};

// VIEW ALL PRODUCTS
exports.allProducts = async (req, res) => {

  const page = parseInt(req.query.page) || 1;
  adminHelpers.getProducts(page).then((response) => {
    let {products,totalPages} = response
    res.render("adminViews/products", { products, page, totalPages}); 
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
  const productImages = req.files != null ? req.files.map((img) => img.path) : null

  adminHelpers.newProduct(data, productImages).then(() => {
    res.redirect("back");
  })
};

// EDIT PRODUCT PAGE
exports.editProduct = async (req, res) => {
  adminHelpers.editProduct(req.query.productId).then((result) => {
    const { product, categories } = result
    res.render("adminViews/editProduct", { product, categories });
  })
};

// EDIT PRODUCT
exports.editDetails = async (req, res) => {
  const productImages = req.files.length != 0 ? req.files.map((img) => img.path) : null
  adminHelpers.editProductDetails(req.query.productId, req.body, productImages).then(() => { 
    res.redirect('/admin/allProducts')
  })
};

//  DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  adminHelpers.deleteProduct(req.params.id).then(() => {
    res.json({status:true})
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
    res.json({status:true})
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
    res.json({status:true})
  })
};

// RESTORE CATOGORY
exports.restoreCategory = (req, res)=>{
  adminHelpers.restoreCategory(req.params.id).then(()=>{
    res.json({status:true})
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
    res.json({status:true})
  })
}

// RESTORE SUBCATEGORIES
exports.restoreSubcategory = (req,res) =>{
  adminHelpers.restoreSubcategory(req.params.id).then(()=>{
    res.json({status:true})
  })
} 

// COUPON'S PAGE
exports.coupons = (req,res) =>{
  adminHelpers.getCoupons().then(response =>{
    let coupons = response != null ? response : [] 
    res.render('adminViews/coupon',{coupons,moment})
  })
}

// NEW COUPON
exports.newCoupon = (req,res) =>{
  adminHelpers.newCoupon(req.body).then(()=>{
    res.json({status:true})
  })
}

// DELETE COUPON
exports.deleteCoupon = (req,res) =>{
  console.log(req.params.id);
  adminHelpers.deleteCoupon(req.params.id).then(()=>{
    res.json({status:true})
  })
}

// RESTORE COUPON
exports.restoreCoupon = (req,res) =>{
  adminHelpers.restoreCoupon(req.params.id).then(()=>{
    console.log(req.params.id);
    res.json({status:true})
  })
}

// BANNER PAGE
exports.banners = (req,res)=>{
  adminHelpers.getBanners().then((banners)=>{
    res.render('adminViews/banner',{banners})
  })
}

// ADD BANNER FORM
exports.addBanner = (req,res) =>{
  res.render('adminViews/addBanner')
}

// NEW BANNER
exports.newBanner = (req,res) =>{
  req.files.forEach(img => { });
  let image = req.files.map((img) => img.filename)
  adminHelpers.newBanner(req.body,image[0]).then(()=>{
    res.redirect('back')
  })
}

// DELETE BANNER
exports.deleteBanner =(req,res)=>{
  adminHelpers.deleteBanner(req.query.id).then(()=>{
    res.json({status:true})
  })
}

// EDIT BANNER FORM
exports.getBanner = (req,res)=>{
  adminHelpers.getBanner(req.query.id).then((banner)=>{
    res.render('adminViews/editBanner',{banner})
  })
}

// EDIT BANNER
exports.editBanner = (req,res)=>{
    const image = req.files.length != 0 ? req.files.map((img) => img.filename) : null
    adminHelpers.editBanner(req.query.id,req.body,image)
    res.redirect('/admin/banners')
  }

// ORDERS
exports.orders = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  adminHelpers.orders(page).then((response)=>{
    let {orders,totalPages} = response
    res.render("adminViews/orders",{orders,moment, page, totalPages})
  })
};

// ORDER DETAILS PAGE
exports.orderDetails = (req,res) =>{
  let orderId = req.params.orderId
  adminHelpers.orderDetails(orderId).then((order)=>{
    res.render("adminViews/orderDetails",{order,moment})
  })
}

// CHANGE ORDER STATUS
exports.changeOrderStatus = (req,res) =>{
  let orderId = req.body.orderId
  let status = req.body.status
  adminHelpers.changeOrderStatus(orderId,status).then(()=>{
    res.json({response:true})
  })
}

// CHANGE PAIMENT STATUS
exports.changePaymentStatus = (req,res) =>{
  let orderId = req.body.id
  adminHelpers.changePaymentStatus(orderId).then(()=>{
    res.json({response:true})
  })
}
