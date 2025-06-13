// routes/seller.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const User = require("../models/User");

router.post("/become-seller", verifyToken, async (req, res) => {
  try {
    const user = req.user;
    if (user.role === "seller" || user.role === "admin") {
      return res.status(400).json({ message: "Sei già un venditore o admin" });
    }
    user.role = "seller";
    await user.save();
    res.json({ message: "Sei diventato un venditore!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
