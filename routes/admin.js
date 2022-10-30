const express = require('express');
const router = express.Router();
const controller = require('../controller/adminController')


// GET METHODS
router.get('/',controller.login);
router.get('/dashboard',controller.adminHome)
router.get('/allProducts',controller.allProducts)
router.get('/addProduct',controller.addProduct)
router.get('/allUsers',controller.allUsers)

// POST METHODS
router.post('/adminLogin',controller.adminLogin)
router.post('/logout',controller.logout)
router.post('/addProduct',controller.newProduct)

// DELETE METHODS
// router.delete('/products/:id',controller.delete)

module.exports = router;