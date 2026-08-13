const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");

// GET /api/dashboard - summary stats
router.get("/", async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todaysOrders = await Order.find({ createdAt: { $gte: startOfDay } });
    const todaysSales = todaysOrders.reduce((sum, o) => sum + o.total, 0);

    const lowStockProducts = await Product.find({
      $expr: { $lte: ["$quantity", "$lowStockThreshold"] },
    });

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      todaysSales,
      todaysOrderCount: todaysOrders.length,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      recentOrders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
