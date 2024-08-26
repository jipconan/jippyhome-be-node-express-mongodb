const categoriesDao = require('../daos/categories');

module.exports = {
  getAllCategories,
  getCategoriesByTypeData,
  getCategoriesByLevelData,
  getCategoryByName,
  createCategory,
  updateCategory,
  updateCategoriesData,
  deleteCategory
};

async function getAllCategories() {
  return await categoriesDao.find({});
}

async function getCategoriesByTypeData(type) {
  return await categoriesDao.find({ categoryType: type });
}

async function getCategoriesByLevelData(level) {
  return await categoriesDao.find({ level: level });
}

async function getCategoryByName(categoryName) {
  return await categoriesDao.findOne({ name: categoryName });
}

async function createCategory(categoryData) {
  return await categoriesDao.create(categoryData);
}

async function updateCategory(categoryId, categoryData) {
  return await categoriesDao.findByIdAndUpdate(categoryId, categoryData, { new: true });
}

async function updateCategoriesData(categoriesData) {
  const updatedCategories = [];

  for (const categoryData of categoriesData) {
    const { _id, ...updateFields } = categoryData;

    // Directly use the provided fields for the update
    const updatedCategory = await categoriesDao.findByIdAndUpdate(
      _id,
      { $set: updateFields }, // Use $set to ensure all fields are updated or created
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    if (updatedCategory) {
      updatedCategories.push(updatedCategory);
    }
  }

  return updatedCategories;
}


async function deleteCategory(categoryId) {
  return await categoriesDao.findByIdAndDelete(categoryId);
}
