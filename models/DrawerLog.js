const mongoose = require("mongoose");

const drawerLogSchema = new mongoose.Schema(
  {
    startingCash: { type: Number, default: 0 },
    closingCash: { type: Number, default: 0 },
    cashSalesTotal: { type: Number, default: 0 },
    openedAt: { type: Date },
    closedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DrawerLog", drawerLogSchema);
