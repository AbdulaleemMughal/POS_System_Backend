// Run with: node seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const sampleProducts = [
  { name: "Espresso", sku: "BEV-001", category: "Beverages", price: 2.5, quantity: 50, image: "" },
  { name: "Cappuccino", sku: "BEV-002", category: "Beverages", price: 3.5, quantity: 40, image: "" },
  { name: "Croissant", sku: "BAK-001", category: "Bakery", price: 2.75, quantity: 4, image: "" },
  { name: "Bagel", sku: "BAK-002", category: "Bakery", price: 2.25, quantity: 30, image: "" },
  { name: "Turkey Sandwich", sku: "SAN-001", category: "Sandwiches", price: 6.5, quantity: 15, image: "" },
  { name: "Bottled Water", sku: "BEV-003", category: "Beverages", price: 1.5, quantity: 3, image: "" },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pos_system");
  await Product.deleteMany({});
  await Product.insertMany(sampleProducts);
  console.log("✅ Sample products seeded");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
