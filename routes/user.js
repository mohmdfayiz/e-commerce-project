const express = require("express");
const { connection } = require("mongoose");
const router = express.Router();
const controller = require("../controller/userController");
const authenticationController = require("../controller/userAuthController");
const middlewares = require("../middleware/auth-middlewares");

// GET METHODS
router.get("/signup", authenticationController.signup)
router.get('/email_varification', authenticationController.email_vairification)
router.get("/", controller.home)
router.get('/bikes', controller.bikes)
router.get('/accessories', controller.accessories)
router.get('/gadgets', controller.gadgets)
router.get("/product_details/:id", controller.product_details);
router.get("/cart", middlewares.userAuth, controller.cart);
router.get('/wishlist', middlewares.userAuth, controller.wishlist);
router.get('/account', middlewares.userAuth, controller.account);
router.get('/manageAddress', middlewares.userAuth, controller.manageAddress);
router.get('/checkout', middlewares.userAuth, controller.checkout)
router.get('/orderSuccess', middlewares.userAuth, controller.orderSuccess)
router.get('/orders', middlewares.userAuth, controller.orders)
router.get('/orderDetails/:orderId', middlewares.userAuth, controller.orderDetails)

// POST METHODS
router.post("/signup", authenticationController.doSignup)
router.post('/resendOtp', authenticationController.resendOtp)
router.post('/resend', authenticationController.resend)
router.post('/varifyOtp', authenticationController.varifyOtp)
router.post("/logout", authenticationController.logout);
router.post('/addToWishlist/:productId', middlewares.userAuth, controller.addToWishlist);
router.post("/addToCart/:productId", middlewares.userAuth, controller.addToCart)
router.post("/incrementQuantity/:price/:productId", controller.incrementQuantity)
router.post("/decrementQuantity/:price/:productId", controller.decrementQuantity)
router.post('/removeWishlistItem/:id', controller.removeWishlistItem)
router.post('/removeCartItem/:total/:productId', controller.removeCartItem)
router.post('/wishlistToCart/:productId', controller.moveToCart)
router.post('/newAddress', controller.newAddress)
router.post('/changeAddress', controller.checkout)
router.post('/deleteAddress/:id', controller.deleteAddress)
router.post('/placeOrder', controller.placeOrder)
router.post('/verifyPayment', controller.verifyPayment)
router.post('/cancelOrder/:orderId', controller.cancelOrder)


// CHAIN ROUTE
router
    .route("/signin")
    .get(authenticationController.signin)
    .post(authenticationController.doLogin)

router  
    .route('/shop')
    .get(controller.allProducts)
   
router
    .route('/shop/:filter')    
    .get(controller.filterProducts)

router
    .route("/forgotPassword")
    .get(authenticationController.forgotPassword)
    .post(authenticationController.sendOtp)

router
    .route('/emailVarification')
    .get(authenticationController.emailVarification)
    .post(authenticationController.varify)
    
router
    .route('/changePassword')
    .get(authenticationController.changePassword)
    .post(authenticationController.setPassword)

router
    .route('/editAddress/:index')
    .get( middlewares.userAuth,controller.editAddress)
    .post(controller.edit_address)
    
router
    .route('/accountSettings')
    .get( middlewares.userAuth,controller.accountSettings)
    .post(middlewares.userAuth,controller.editProfile)
    .patch(authenticationController.updatePassword)

router
    .route('/applyCoupon/:coupon')
    .post(middlewares.userAuth, controller.applyCoupon) 

module.exports = router;
