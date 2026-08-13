const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, trim: true, default: "General" },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    image: { type: String, default: "" },
    lowStockThreshold: { type: Number, default: 5 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
