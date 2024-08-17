const categoriesModel = require('../models/categories');
const { toLowerCase } = require('../utils/formatText');

module.exports = {
  getCategories,
  getCategoriesByType,
  createCategory,
  updateCategory,
  updateCategories,
  deleteCategory,
};

async function getCategories(req, res) {
  try {
    const categories = await categoriesModel.getAllCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getCategoriesByType(req, res) {
  try {
    // Extract and convert the type parameter to lowercase
    const { type } = req.params;
    const lowercaseTypeName = toLowerCase(type);

    // Check for valid category types, now in lowercase
    if (!lowercaseTypeName || !['room', 'furniture'].includes(lowercaseTypeName)) {
      return res.status(400).json({ message: 'Invalid or missing category type' });
    }

    // Fetch categories based on the lowercase type
    const categories = await categoriesModel.getCategoriesByTypeData(lowercaseTypeName);
    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: 'No categories found for this type' });
    }

    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


async function createCategory(req, res) {
  try {
    const newCategory = await categoriesModel.createCategory(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateCategory(req, res) {
  try {
    const updatedCategory = await categoriesModel.updateCategory(req.params.category_id, req.body);
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateCategories(req, res) {
  try {
    const updatedCategories = await categoriesModel.updateCategoriesData(req.body);
    if (updatedCategories.length === 0) {
      return res.status(404).json({ message: 'Categories not found' });
    }
    res.json(updatedCategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


async function deleteCategory(req, res) {
  try {
    const result = await categoriesModel.deleteCategory(req.params.category_id);
    if (!result) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
