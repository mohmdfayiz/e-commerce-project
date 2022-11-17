const express = require("express");
const { connection } = require("mongoose");
const router = express.Router();
const controller = require("../controller/userController");
const middlewares = require("../middleware/auth-middlewares")

// GET METHODS
router.get("/", controller.home);
router.get("/login", controller.login);
router.get("/signup", controller.signup);
router.get('/email_varification', controller.email_vairification)
router.get("/product_details/:id", controller.product_details);
router.get("/cart", middlewares.userAuth, controller.cart);
router.get('/wishlist', middlewares.userAuth, controller.wishlist);
router.get('/account', middlewares.userAuth, controller.account);
router.get('/manageAddress', middlewares.userAuth, controller.manageAddress);
router.get('/checkout', middlewares.userAuth, controller.checkout)
router.get('/orderSuccess', middlewares.userAuth, controller.orderSuccess)

// POST METHODS
router.post("/signup", controller.doSignup)
router.post('/resendOtp', controller.resendOtp)
router.post('/varifyOtp', controller.varifyOtp)
router.post("/login", controller.doLogin);
router.post("/logout", controller.logout);
router.post('/addToWishlist/:productId', middlewares.userAuth, controller.addToWishlist);
router.post("/addToCart/:productId", middlewares.userAuth, controller.addToCart)
router.post("/incrementQuantity/:price/:productId", controller.incrementQuantity)
router.post("/decrementQuantity/:price/:productId", controller.decrementQuantity)
router.post('/removeWishlistItem/:id', controller.removeWishlistItem)
router.post('/removeCartItem/:total/:productId', controller.removeCartItem)
router.post('/addToCart_wishlist/:productId', controller.moveToCart)
router.post('/newAddress', controller.newAddress)
router.post('/deleteAddress/:id', controller.deleteAddress)
router.post('/placeOrder/:adrsId', controller.placeOrder)

module.exports = router;
