const express = require('express');
const router = express.Router();
const categoriesCtrl = require('../controllers/categories');

// GET all categories
router.get('/', categoriesCtrl.getCategories);

// GET a single category by type
router.get('/:type', categoriesCtrl.getCategoriesByType);

// GET a single category by level
router.get('/level/:level', categoriesCtrl.getCategoriesByLevel);

// POST create a new category
router.post('/', categoriesCtrl.createCategory);

// PUT update an existing category by ID
router.put('/:category_id', categoriesCtrl.updateCategory);

// PUT update all category
router.put('/', categoriesCtrl.updateCategories);

// DELETE a category by ID
router.delete('/:category_id', categoriesCtrl.deleteCategory);

module.exports = router;
