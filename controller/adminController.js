const bcrypt = require("bcrypt");
const session = require("express-session");
const userModel = require("../model/userModel");
const productModel = require("../model/productModel");
const categoryModel = require("../model/categoryModel");
const { isObjectIdOrHexString } = require("mongoose");

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

// ALL USERS
exports.allUsers = async (req, res) => {
  let users = await userModel.find({ type: { $not: { $eq: "admin" } } });
  res.render("adminViews/allUsers", { users, index: 1 });
};

// BLOCK USER
exports.blockUser = async (req, res) => {
  let id = req.params.id;
  await userModel
    .findByIdAndUpdate({ _id: id }, { $set: { type: "Blocked" } })
    .then(() => {
      res.redirect("/admin/allUsers");
    });
};

// UNBLOCK USER
exports.unblockUser = async (req, res) => {
  let id = req.params.id;
  await userModel
    .findByIdAndUpdate({ _id: id }, { $set: { type: "user" } })
    .then(() => {
      res.redirect("/admin/allUsers");
    });
};

// VIEW ALL PRODUCTS
exports.allProducts = async (req, res) => {
  let product = await productModel.find({ isDeleted: false });
  res.render("adminViews/products", { product });
};

// ADD PRODUCT FORM
exports.addProduct = async (req, res) => {
  let categories = await categoryModel.find();
  res.render("adminViews/addProduct", { categories });
};

// NEW PRODUCT
exports.newProduct = async (req, res) => {
  const { category, productName, description, price, quantity } = req.body;

  const image = req.file;
  console.log(image);

  const newProduct = productModel({
    category,
    productName,
    description,
    price,
    quantity,
    imageUrl: image.path,
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

// EDIT PRODUCT PAGE
exports.editProduct = async (req, res) => {
  let id = req.params.id;
  let product = await productModel.findOne({ _id: id });
  let categories = await categoryModel.find({
    category: { $ne: product.category },
  });

  res.render("adminViews/editProduct", { product, categories });
};

// EDIT PRODUCT
exports.editDetails = async (req, res) => {
  const { category, productName, description, price, quantity } = req.body;
  console.log(req.body);

  if (req.file) {
    let image = req.file;
    await productModel.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { imageUrl: image.path } }
    );
  }

  let details = await productModel.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        category,
        productName,
        description,
        price,
        quantity,
      },
    }
  );
  await details.save().then(() => {
    res.redirect("/admin/allProducts");
  });
};

//  DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  let id = req.params.id;
  await productModel.findByIdAndUpdate(
    { _id: id },
    { $set: { isDeleted: true } }
  );
  res.redirect("/admin/allProducts");
};

// DELETED PRODUCTS PAGE
exports.deletedProduct = async (req, res) => {
  let product = await productModel.find({ isDeleted: true });
  res.render("adminViews/deletedProducts", { product });
};

// UNDO DELETE
exports.undoDeleteProduct = async (req, res) => {
  let id = req.params.id;
  await productModel.findOneAndUpdate(
    { _id: id },
    { $set: { isDeleted: false } }
  );
  res.redirect("/admin/deletedProducts");
};

// CATEGORIES
exports.categories = async (req, res) => {
  let categories = await categoryModel.find({});
  res.render("adminViews/categories", { categories });
};

// NEW CATEGORY
exports.addCatergory = (req, res) => {
  const category = req.body.category;
  const newCategory = categoryModel({ category });
  newCategory.save().then(res.redirect("/admin/categories"));
};

// DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
  let id = req.params.id;
  console.log("hi");
  await categoryModel.findByIdAndDelete({ _id: id });
  res.redirect("/admin/categories");
};

// ORDERS
exports.orders = (req, res) => {
  res.render("adminViews/orders");
};
