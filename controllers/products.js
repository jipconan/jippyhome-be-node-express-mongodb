const productsModel = require('../models/products');
const categoriesModel = require('../models/categories');
const { toLowerCase, formatArrayToPipeSeparatedString } = require('../utils/formatText');

module.exports = {
  getAllProducts,
  getProductById,
  getSnipcartProductById,
  getProductsByCategoryName,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsBySubCategory,
};

async function getAllProducts(req, res) {
  try {
    const { price_min, price_max, color, material, furnitureCategory, roomCategory } = req.query;

    // Build the query object
    const query = {};

    // Add filters to query
    if (price_min && price_max) {
      query.price = { $gte: Number(price_min), $lte: Number(price_max) };
    }
    if (color) {
      query.color = { $in: color.split(',') };
    }
    if (material) {
      query.material = { $in: material.split(',') };
    }
    if (furnitureCategory) {
      query.furnitureCategory = { $in: furnitureCategory.split(',').map(id => id.trim()) };
    }
    if (roomCategory) {
      query.roomCategory = { $in: roomCategory.split(',').map(id => id.trim()) };
    }

    // Fetch products based on query
    const products = await productsModel.findProductsByQuery(query);

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

// New function to remap data for Snipcart
async function getSnipcartProductById(req, res) {
  try {
    // Fetch product by ID from the database
    const product = await productsModel.getProductById(req.params.product_id);
    
    // Check if the product was found
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Prepare custom fields based on product data by converting arrays to pipe-separated strings
    const materialOptions = product.material && product.material.length > 0 ? product.material.join('|') : '';
    const colorOptions = product.color && product.color.length > 0 ? product.color.join('|') : '';

    // Remap the product data to match frontend data attributes
    const snipcartProduct = {
      id: product.public_id,
      name: product.name,
      price: product.price,
      url: `https://jippyhome-be-node-express-mongodb.onrender.com/products/id/${product._id}`,
      description: product.description,
      image: product.imageUrl.length > 0 ? product.imageUrl[0] : '',
      customFields: [
        {
          name: "material",
          options: materialOptions // Pipe-separated string
        },
        {
          name: "color",
          options: colorOptions // Pipe-separated string
        }
      ]
    };

    // Respond with the formatted product data
    res.json(snipcartProduct);
  } catch (err) {
    // Handle errors
    res.status(500).json({ error: err.message });
  }
}



async function getProductsByCategoryName(req, res) {
  try {
    const { category_name } = req.params;
    const lowercaseCategoryName = toLowerCase(category_name);
    console.log("In - CTRL - getPrdouctByCategoryName - lowercaseCategoryName:", lowercaseCategoryName)

    const category = await categoriesModel.getCategoryByName(lowercaseCategoryName);
    console.log("OUT - CTRL - getPrdouctByCategoryName - category:", category)
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    let products;
    
    // Determine the category level and fetch products accordingly
    if (category.level === 0) {
      products = await productsModel.getProductsByRoomCategoryData(category._id);
    } else if (category.level === 1) {
      products = await productsModel.getProductsByFurnitureCategoryData(category._id);
    } else if (category.level === 2) {
      products = await productsModel.getProductsBySubCategoryData(category._id);
    }

    // Check if products are found
    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No products found for this category' });
    }

    // Send the products as a response
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
