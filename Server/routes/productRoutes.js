const express = require("express");
const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary"); // Cloudinary configuration
const upload = require("../middleware/upload"); // Multer configuration for file handling
const router = express.Router();

// GET: Fetch all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

//product by id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product details" });
  }
});

// POST: Add a new product (car) with image upload to Cloudinary
router.post("/", upload.single('image'), async (req, res) => {
  try {
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Create a new product with the image URL returned from Cloudinary
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: result.secure_url, // Cloudinary image URL
      category: req.body.category,
    });

    // Save the product to the database
    await product.save();

    // Respond with the created product
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading image to Cloudinary" });
  }
});

// PUT: Update a product
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
});

// PUT: Add more images to an existing product
router.put("/:id/images", upload.array("images", 3), async (req, res) => {
  try {
    console.log("🔹 Files received:", req.files);
    console.log("🔹 Product ID:", req.params.id);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      console.log("❌ Product not found!");
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Ensure "images" exists as an array
    if (!Array.isArray(product.images)) {
      product.images = []; // Convert to an array if not already
    }

    // Upload new images to Cloudinary
    const newImageUrls = await Promise.all(
      req.files.map(async (file) => {
        console.log(`Uploading file: ${file.originalname}`);
        const result = await cloudinary.uploader.upload(file.path);
        console.log(`✅ Uploaded: ${result.secure_url}`);
        return result.secure_url;
      })
    );

    // ✅ Append new images to the existing array
    product.images = [...product.images, ...newImageUrls];
    await product.save();

    res.json({ message: "Images added successfully!", product });
  } catch (error) {
    console.error("❌ Error Details:", error);
    res.status(500).json({ message: "Error updating product images", error: error.message });
  }
});






// DELETE: Delete a product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
});

module.exports = router;
