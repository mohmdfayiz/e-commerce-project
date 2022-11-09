const express = require('express');
const router = express.Router();
const controller = require('../controller/adminController')

// GET METHODS
router.get('/', controller.login)
router.get('/dashboard', controller.adminHome)
router.get('/allProducts', controller.adminSession, controller.allProducts)
router.get('/deletedProducts', controller.adminSession, controller.deletedProducts)
router.get('/addProduct', controller.adminSession, controller.addProduct)
router.get('/editProduct/:id', controller.adminSession, controller.editProduct)
router.get('/allUsers', controller.adminSession, controller.allUsers)
router.get('/categories', controller.adminSession, controller.categories)
router.get('/orders', controller.adminSession, controller.orders)
router.get('/subcategories', controller.adminSession, controller.subcategories)

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
router.post('/addSubcategory',controller.addSubcatergory)
router.post('/restoreCategory/:id',controller.restoreCategory)
router.post('/deleteSubcategory/:id', controller.deleteSubcategory)
router.post('/restoreSubcategory/:id',controller.restoreSubcategory)

module.exports = router;