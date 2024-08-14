const productsModel = require('../models/products');
const categoriesModel = require('../models/categories');

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsBySubCategory,
};

async function getAllProducts(req, res) {
  try {
    const products = await productsModel.getAllProductsData();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getProductById(req, res) {
  try {
    const product = await productsModel.getProductById(req.params.product_id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getProductsByCategory(req, res) {
  // console.log("incoming - controller - getProductsByCategory req.params:", req.params)
  try {
    const { category_id } = req.params;
    const products = await productsModel.getProductsByCategoryData(category_id);
    // console.log("outgoingcoming - controller - getProductsByCategory products:", products)
    
    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No products found for this category' });
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createProduct(req, res) {
  try {
    const newProduct = await productsModel.createProductData(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateProduct(req, res) {
  try {
    const updatedProduct = await productsModel.updateProductData(req.params.product_id, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const result = await productsModel.deleteProductData(req.params.product_id);
    if (!result) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getProductsBySubCategory(req, res) {
  try {
    // Fetch all products and categories
    const products = await productsModel.getAllProductsData();
    // console.log('Fetched products:', products);

    const categories = await categoriesModel.getAllCategories();
    // console.log('Fetched categories:', categories);

    // Create a mapping of category IDs to their names
    const categoryNames = categories.reduce((acc, category) => {
      acc[category._id.toString()] = category.name;
      return acc;
    }, {});
    // console.log('Category Names:', categoryNames);

    // Group products by furnitureCategory and subCategory
    const groupedByCategoryType = products.reduce((acc, product) => {
      const furnitureCategory = categoryNames[product.furnitureCategory.toString()] || 'Unknown Furniture Category';
      const subCategory = categoryNames[product.subCategory.toString()] || 'Unknown Sub-Category';

      if (!acc[furnitureCategory]) {
        acc[furnitureCategory] = {};
      }

      if (!acc[furnitureCategory][subCategory]) {
        acc[furnitureCategory][subCategory] = [];
      }

      acc[furnitureCategory][subCategory].push(product);
      // console.log('Intermediate Accumulator:', acc);

      return acc;
    }, {});

    // console.log('Grouped by category type:', groupedByCategoryType);

    // Send response
    res.json(groupedByCategoryType);
  } catch (error) {
    console.error('Error in getProductsBySubCategory:', error.message);
    res.status(500).json({ error: error.message });
  }
}

