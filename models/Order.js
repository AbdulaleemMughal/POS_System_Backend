const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    sku: String,
    price: Number,
    quantity: Number,
    lineTotal: Number,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0.1 },
    taxAmount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cash", "card"], required: true },
    amountReceived: { type: Number, default: 0 },
    changeDue: { type: Number, default: 0 },
    orderNumber: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
