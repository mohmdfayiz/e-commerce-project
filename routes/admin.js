const express = require('express');
const router = express.Router();
const controller = require('../controller/adminController')

// GET METHODS
router.get('/',controller.login);
router.get('/dashboard',controller.adminHome)
router.get('/allProducts',controller.allProducts)

// POST METHODS
router.post('/adminLogin',controller.adminLogin)
router.post('/logout',controller.logout)

module.exports = router;