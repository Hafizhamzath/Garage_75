const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  images: {
    type:[String],
    default:[]
  },
  category: String,
});

module.exports = mongoose.model("Product", productSchema);
