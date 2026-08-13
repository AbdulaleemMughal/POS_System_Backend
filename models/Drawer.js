const mongoose = require("mongoose");

// Singleton document — there is only ever one active drawer at a time.
const drawerSchema = new mongoose.Schema(
  {
    cashInDrawer: { type: Number, default: 0 },
    startingCash: { type: Number, default: 0 },
    openedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Drawer", drawerSchema);
