const express = require("express");
const { connection } = require("mongoose");
const router = express.Router();
const controller = require("../controller/userController");

// GET METHODS
router.get("/login", controller.login);
router.get("/signup", controller.signup);
router.get("/", controller.home);
router.get("/product_details/:id", controller.product_details);
router.get("/cart", controller.userSession, controller.cart);
router.get('/account', controller.userSession, controller.account);
router.get('/wishlist', controller.userSession, controller.wishlist);

// POST METHODS
router.post("/signup", controller.doSignup);
router.post("/login", controller.doLogin);
router.post("/logout", controller.logout);
router.post('/addToWishlist/:productId', controller.userSession, controller.addToWishlist);
router.post("/addToCart/:productId", controller.userSession, controller.addToCart)
router.post('/removeWishlistItem/:id', controller.removeWishlistItem)
router.post('/removeCartItem/:productId', controller.removeCartItem)
router.post('/addToCart_wishlist/:productId', controller.moveToCart)

module.exports = router;
