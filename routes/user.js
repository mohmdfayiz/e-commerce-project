const express = require("express");
const { connection } = require("mongoose");
const router = express.Router();
const controller = require("../controller/userController");

// GET METHODS
router.get("/", controller.home);
router.get("/login", controller.login);
router.get("/signup", controller.signup);
router.get("/cart", controller.userSession, controller.cart);
router.get("/product_details/:id", controller.product_details);
router.get('/account',controller.userSession, controller.account);

// POST METHODS
router.post("/signup", controller.doSignup);
router.post("/login", controller.doLogin);
router.post("/logout", controller.logout);

module.exports = router;
