const Product = require("../models/Product");

const getAllProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

const createProduct = async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
};

module.exports = { getAllProducts, createProduct };
