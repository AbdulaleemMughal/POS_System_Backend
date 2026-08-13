const express = require("express");
const router = express.Router();
const Drawer = require("../models/Drawer");
const DrawerLog = require("../models/DrawerLog");

// Ensures there's always exactly one drawer document to work with.
async function getOrCreateDrawer() {
  let drawer = await Drawer.findOne();
  if (!drawer) {
    drawer = await Drawer.create({});
  }
  return drawer;
}

// GET /api/drawer - current cash in drawer + recent history
router.get("/", async (req, res) => {
  try {
    const drawer = await getOrCreateDrawer();
    const history = await DrawerLog.find().sort({ closedAt: -1 }).limit(15);
    res.json({ ...drawer.toObject(), history });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/drawer/reset - log current totals, then zero out (or reset to a new starting float)
router.post("/reset", async (req, res) => {
  try {
    const { startingCash = 0 } = req.body;
    const drawer = await getOrCreateDrawer();

    const cashSalesTotal = drawer.cashInDrawer - drawer.startingCash;

    await DrawerLog.create({
      startingCash: drawer.startingCash,
      closingCash: drawer.cashInDrawer,
      cashSalesTotal,
      openedAt: drawer.openedAt,
      closedAt: new Date(),
    });

    drawer.startingCash = Number(startingCash) || 0;
    drawer.cashInDrawer = Number(startingCash) || 0;
    drawer.openedAt = new Date();
    await drawer.save();

    const history = await DrawerLog.find().sort({ closedAt: -1 }).limit(15);
    res.json({ ...drawer.toObject(), history });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
