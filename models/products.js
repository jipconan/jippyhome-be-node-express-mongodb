const productsDao = require('../daos/products');

module.exports = {
  getAllProductsData,
  getProductById,
  getProductsByCategoryData,
  createProductData,
  updateProductData,
  deleteProductData,
};

async function getAllProductsData() {
  return await productsDao.find({});
}

async function getProductById(productId) {
  return await productsDao.findById(productId);
}

async function getProductsByCategoryData(categoryId) {
  return await productsDao.find({ roomCategory: categoryId });
}

async function createProductData(productData) {
  return await productsDao.create(productData);
}

async function updateProductData(productId, productData) {
  return await productsDao.findByIdAndUpdate(productId, productData, { new: true });
}

async function deleteProductData(productId) {
  return await productsDao.findByIdAndDelete(productId);
}
