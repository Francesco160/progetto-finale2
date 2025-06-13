const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const verifyToken = require("../middlewares/auth");

// Aggiungi prodotto al carrello
router.post("/", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  if (!productId || quantity == null || quantity < 1) {
    return res.status(400).json({ message: "ProductId e quantity validi sono obbligatori" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Prodotto non trovato" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utente non trovato" });

    // Cerca se il prodotto è già nel carrello
    const itemIndex = user.cart.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
      // Aggiorna quantità
      user.cart[itemIndex].quantity += quantity;
    } else {
      // Aggiungi nuovo prodotto al carrello
      user.cart.push({ productId, quantity });
    }

    await user.save();
    res.json({ message: "Prodotto aggiunto al carrello", cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: "Errore server", error: err.message });
  }
});

// Rimuovi prodotto dal carrello
router.delete("/:productId", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.productId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utente non trovato" });

    const itemIndex = user.cart.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Prodotto non presente nel carrello" });
    }

    user.cart.splice(itemIndex, 1);
    await user.save();
    res.json({ message: "Prodotto rimosso dal carrello", cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: "Errore server", error: err.message });
  }
});

// Visualizza carrello utente
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.productId");
    if (!user) return res.status(404).json({ message: "Utente non trovato" });
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Errore server", error: err.message });
  }
});

module.exports = router;
