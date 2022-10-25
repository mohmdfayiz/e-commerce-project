const express = require('express');
const router = express.Router();
const controller = require('../controller/userController')


router.get('/',controller.home)
router.get('/login',controller.login)
router.get('/signup',controller.signup)

router.post('/signup',controller.doSignup)
router.post('/login',controller.doLogin)

module.exports = router;