const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  try {
    const latest = await Product.find().sort({ createdAt: -1 }).limit(8);
    const bestRated = await Product.find().sort({ averageRating: -1 }).limit(8);
    
    // Ordinati per numero di recensioni decrescente (più popolari)
    const mostPopular = await Product.find().sort({ "reviews.length": -1 }).limit(8);

    const cheap = await Product.find().sort({ price: 1 }).limit(8);

    res.json({
      latestProducts: latest,
      bestRatedProducts: bestRated,
      mostPopularProducts: mostPopular,
      affordableProducts: cheap
    });
  } catch (err) {
    res.status(500).json({ message: "Errore nel caricamento della homepage", error: err.message });
  }
});

module.exports = router;
