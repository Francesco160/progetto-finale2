const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const verifyToken = require("../middlewares/auth");

// GET: Ottieni tutti gli ordini dell'utente loggato
router.get("/", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("items.productId", "name price");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Errore nel recupero degli ordini", error: err.message });
  }
});

// POST: Crea un nuovo ordine (es. da carrello)
router.post("/", verifyToken, async (req, res) => {
  const { items, total } = req.body;
  try {
    const newOrder = new Order({
      user: req.user.id,
      items,
      total,
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: "Errore nel salvataggio ordine", error: err.message });
  }
});

module.exports = router;
