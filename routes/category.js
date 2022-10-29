const express = require('express');
// const { body } = require('express-validator/check');

const categoryController = require('../controllers/category');

const router = express.Router();
const isAuth = require('../middleware/is-auth.js');

// GET /all categories
router.get('/', isAuth, categoryController.getAllCategories);

// POST /add category
router.post('/', isAuth, categoryController.createCategory);

// GET /single category
router.get('/search', isAuth, categoryController.getCategory);

// PUT /update category
router.put('/', isAuth, categoryController.updateCategory);

// DELETE /delete category
router.delete('/', isAuth, categoryController.deleteCategory);

module.exports = router;