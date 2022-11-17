const express = require("express");
const { connection } = require("mongoose");
const router = express.Router();
const controller = require("../controller/userController");
const middlewares = require("../middleware/user-middlewares")

// GET METHODS
router.get("/", controller.home);
router.get('/shop',controller.shop);
router.get("/login", controller.login);
router.get("/signup", controller.signup);
router.get('/email_varification', controller.email_vairification)
router.get("/product_details/:id", controller.product_details);
router.get("/cart", middlewares.userSession, controller.cart);
router.get('/wishlist', middlewares.userSession, controller.wishlist);
router.get('/account', middlewares.userSession, controller.account);
router.get('/manageAddress',middlewares.userSession,controller.manageAddress);
router.get('/checkout',middlewares.userSession,controller.checkout)

// POST METHODS
router.post("/signup", controller.doSignup)
router.post('/resendOtp',controller.resendOtp)
router.post('/varifyOtp',controller.varifyOtp)
router.post("/login", controller.doLogin);
router.post("/logout", controller.logout);
router.post('/addToWishlist/:productId', middlewares.userSession, controller.addToWishlist);
router.post("/addToCart/:productId", middlewares.userSession, controller.addToCart)
router.post("/incrementQuantity/:price/:productId",controller.incrementQuantity)
router.post("/decrementQuantity/:price/:productId",controller.decrementQuantity)
router.post('/removeWishlistItem/:id', controller.removeWishlistItem)
router.post('/removeCartItem/:total/:productId', controller.removeCartItem)
router.post('/addToCart_wishlist/:productId', controller.moveToCart)
router.post('/newAddress',controller.newAddress)
router.post('/deleteAddress/:id',controller.deleteAddress)

module.exports = router;
