const express = require('express');
const { body } = require('express-validator/check')

const userController = require('../controllers/user');
const User = require('../models/user');

const router = express.Router();
// const isAuth = require('../middleware/is-auth.js');


// POST /Login
router.post('/login', userController.logIn);

// PUT /sign-up
router.put('/signup', [
        body('password')
        .trim()
        .isLength( {min: 3 }),
        body('name')
        .trim()
        .not()
        .isEmpty()
], userController.signUp);


module.exports = router;