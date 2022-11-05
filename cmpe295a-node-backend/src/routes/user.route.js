var express = require('express');
var router = express.Router();

// import user controller
const userController = require('../controllers/user.controller');

// Signup       POST
router.post('/signup', userController.signup);

// Login        POST
router.post('/login', userController.login);


module.exports = router;