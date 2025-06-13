const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const User = require("../models/User");
const Product = require("../models/Product");

// Aggiungi prodotto alla wishlist
router.post("/", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Prodotto non trovato" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utente non trovato" });

    // Evita duplicati
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: "Prodotto già nella wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();

    res.json({ message: "Prodotto aggiunto alla wishlist", wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: "Errore server", error: err.message });
  }
});

// Rimuovi prodotto dalla wishlist
router.delete("/:productId", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.productId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utente non trovato" });

    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    res.json({ message: "Prodotto rimosso dalla wishlist", wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: "Errore server", error: err.message });
  }
});

// Visualizza wishlist
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist");
    if (!user) return res.status(404).json({ message: "Utente non trovato" });

    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: "Errore server", error: err.message });
  }
});

module.exports = router;
