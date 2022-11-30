const express = require('express');
const router = express.Router();
const controller = require('../controller/adminController')
const middleware = require('../middleware/auth-middlewares')

// GET METHODS
router.get('/', controller.login)
router.get('/dashboard', controller.adminHome)
router.get('/deletedProducts', middleware.adminSession, controller.deletedProducts)
router.get('/editProduct/:id', middleware.adminSession, controller.editProduct)
router.get('/allUsers', middleware.adminSession, controller.allUsers)
router.get('/categories', middleware.adminSession, controller.categories)
router.get('/orders', middleware.adminSession, controller.orders)
router.get('/subcategories', middleware.adminSession, controller.subcategories)
router.get('/order/:orderId',middleware.adminSession, controller.orderDetails)

// POST METHODS
router.post('/adminLogin', controller.adminLogin)
router.post('/logout', controller.logout)
router.post('/addProduct', controller.newProduct)
router.post('/deleteProduct/:id', controller.deleteProduct)
router.post('/undoDeleteProduct/:id', controller.undoDeleteProduct)
router.post('/addCategory', controller.addCatergory)
router.post('/deleteCategory/:id', controller.deleteCategory)
router.post('/editProductDetails/:id', controller.editDetails)
router.post('/blockUser/:id', controller.blockUser)
router.post('/unblockUser/:id', controller.unblockUser)
router.post('/addSubcategory', controller.addSubcatergory)
router.post('/restoreCategory/:id', controller.restoreCategory)
router.post('/deleteSubcategory/:id', controller.deleteSubcategory)
router.post('/restoreSubcategory/:id', controller.restoreSubcategory)
router.post('/changeOrderStatus',controller.changeOrderStatus)
router.post('/changePaymentStatus',controller.changePaymentStatus)

// CAHIN ROUTE
router
    .route('/allProducts')
    .get(middleware.adminSession, controller.allProducts)
    
router
    .route('/addProduct') 
    .get(middleware.adminSession, controller.addProduct)

router
    .route('/coupons')
    .get(middleware.adminSession, controller.coupons)
    .post(middleware.adminSession, controller.newCoupon)

router
    .route('/couponAction/:id')
    .post(middleware.adminSession,controller.deleteCoupon)
    .patch(middleware.adminSession,controller.restoreCoupon)

module.exports = router;