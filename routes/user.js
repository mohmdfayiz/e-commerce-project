const express = require('express');
const router = express.Router();
const controller = require('../controller/userController')

// GET METHODS
router.get('/',controller.home)
router.get('/login',controller.login)
router.get('/signup',controller.signup)

// POST METHODS
router.post('/signup',controller.doSignup)
router.post('/login',controller.doLogin)
router.post('/logout',controller.logout)

module.exports = router;