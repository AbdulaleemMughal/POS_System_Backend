require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const PORT = process.env.PORT;

const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const dashboardRoutes = require("./routes/dashboard");
const drawerRoutes = require("./routes/drawer");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB

// Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/drawer", drawerRoutes);

app.get("/", (req, res) => {
  res.send("POS API is running...");
});

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
