const express = require('express');
const router = express.Router();
const controller = require('../controller/adminController')

router.get('/',controller.login);
router.get('/dashboard',controller.adminHome)

router.post('/adminLogin',controller.adminLogin)

module.exports = router;