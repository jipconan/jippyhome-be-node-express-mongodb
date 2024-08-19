const productsDao = require('../daos/products');

module.exports = {
  getAllProductsData,
  findProductsByQuery,
  getProductById,
  getProductsByRoomCategoryData,
  getProductsByFurnitureCategoryData,
  getProductsBySubCategoryData,
  createProductData,
  updateProductData,
  deleteProductData,
};

async function getAllProductsData() {
  return await productsDao.find({});
}

async function findProductsByQuery(query) {
  return await productsDao.find(query);
}

async function getProductById(productId) {
  return await productsDao.findById(productId);
}

async function getProductsByRoomCategoryData(param) {
  console.log("Incoming Model - Room - param:", param)
  return await productsDao.find({ roomCategory: param });
}

async function getProductsByFurnitureCategoryData(param) {
  console.log("Incoming Model - Furniture - param:", param)
  return await productsDao.find({ furnitureCategory: param });
}

async function getProductsBySubCategoryData(param) {
  console.log("Incoming Model - Sub - param:", param)
  return await productsDao.find({ subCategory: param });
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
