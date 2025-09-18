const productModel = require("../models/productModel");
const fs = require("fs");
exports.addProduct = async (req, res) => {
  try {
    const { productName, description, quantity, price } = req.body;
    const checkProduct = await productModel.findOne({ productName });
    if (checkProduct) {
      return res.status(400).json({
        message: `${productName} already exists, update the quantity`,
      });
    }
    const files = req.files;

    // get the file paths
    const imagePaths = files.map((el) => el.path);
    console.log(imagePaths);

    // instantiate the product model
    const data = new productModel({
      productName,
      description,
      quantity,
      price,
      image: imagePaths,
    });

    // save the changes to the database
    const newProduct = new productModel(data);
    const savedProduct = await newProduct.save();

    // send a success response
    return res.status(201).json({
      message: "Product added successfully",
      data: savedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const getAll = await productModel.find();
    return res.status(200).json({
      message: "All products retrieved",
      data: getAll,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getOne = async (req, res) => {
  try {
    const productId = req.params.id;
    const retrieved = await productModel.findById(productId);
    if (!retrieved) {
      return res.status(404).json({
        message: "Product not found",
      });
    } else {
      return res.status(200).json({
        message: "One product retrieved successfuly",
        data: retrieved,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    //extract the required fields from req.body
    const { productName, description, price, quantity } = req.body;
    const productId = req.params.id;
    // find the product from in the database by the id
    const product = await productModel.findById(productId);
    // check if the product exists
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // create the product data to be updated
    const data = {
      productName: productName || product.productName,
      description: description || product.description,
      quantity: quantity || product.quantity,
      price: price || product.price,
      image: product.image,
    };

    if (req.files && req.files[0]) {
      // get the old file paths
      const oldFilePaths = product.image;
      // get the new file paths
      const imagePaths = req.files.map((el) => el.path);
      oldFilePaths.forEach((element) => {
        const fileCheck = fs.existsSync(element);
        if (fileCheck) {
          fs.unlinkSync(element);
        }
      });
      data.image = imagePaths;
    }

    const updateProduct = await productModel.findByIdAndUpdate(
      productId,
      data,
      { new: true }
    );

    return res.status(200).json({
      message: "Product successfully updated",
      data: updateProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const checkProduct = await productModel.findById(productId);
    if (!checkProduct) {
      return res.status(404).json({
        message: "product not found",
      });
    }

    const deletedProduct = await productModel.findByIdAndDelete(productId);

    const oldFilePath = deletedProduct.image;

    if (oldFilePath && oldFilePath.length > 0) {
      oldFilePath.forEach((el) => {
        const fileCheck = fs.existsSync(el);
        if (fileCheck) {
          fs.unlinkSync(el);
        }
        console.log(fileCheck);
      });
    }
    return res.status(200).json({
      message: " product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
};
