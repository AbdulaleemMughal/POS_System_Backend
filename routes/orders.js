const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const Drawer = require("../models/Drawer");

// GET /api/orders - list all orders (most recent first)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/:id
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/orders - create a new order (checkout) & decrement stock
router.post("/", async (req, res) => {
  try {
    const {
      items,
      subtotal,
      discountPercent,
      discountAmount,
      taxRate,
      taxAmount,
      total,
      paymentMethod,
      amountReceived,
      changeDue,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Validate stock availability
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }
      if (product.quantity < item.quantity) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${product.name}. Available: ${product.quantity}` });
      }
    }

    // Decrement stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: -item.quantity },
      });
    }

    const orderNumber = `ORD-${Date.now()}`;

    const order = new Order({
      items,
      subtotal,
      discountPercent,
      discountAmount,
      taxRate,
      taxAmount,
      total,
      paymentMethod,
      amountReceived,
      changeDue,
      orderNumber,
    });

    const saved = await order.save();

    // Cash sales physically add money to the drawer (card sales don't).
    // `total` already accounts for change given back, since
    // amountReceived - changeDue === total.
    if (paymentMethod === "cash") {
      await Drawer.findOneAndUpdate(
        {},
        { $inc: { cashInDrawer: total } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
