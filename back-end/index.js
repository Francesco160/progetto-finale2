const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const sellerRoutes = require("./routes/seller");
const authRoutes = require("./routes/auth");
const cartRouter = require("./routes/cart"); 
const homeRoutes = require("./routes/home");
const wishlistRoutes = require("./routes/wishlist");
const verifyEmailRoutes = require("./routes/verifyEmail");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/cart", cartRouter);
app.use("/api/home", homeRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api", verifyEmailRoutes);

const PORT = process.env.PORT

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error(err));
