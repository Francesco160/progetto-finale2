const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Order = require("../models/Order");
const verifyToken = require("../middlewares/auth");
const upload = require("../middlewares/upload");

// Middleware di validazione input prodotto
const validateProductInput = (req, res, next) => {
  const { name, category, price, description } = req.body;
  if (!name || !category || !price || !description) {
    return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
  }
  next();
};

// ✅ CREA PRODOTTO
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      seller: req.user.id,
      imageUrl: req.file?.path || null,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore nel salvataggio del prodotto" });
  }
});

// ✅ MODIFICA PRODOTTO
router.put(
  "/:id",
  verifyToken,
  upload.single("image"),
  validateProductInput,
  async (req, res) => {
    try {
      const user = req.user;

      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: "Prodotto non trovato" });

      if (product.seller.toString() !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Non puoi modificare questo prodotto" });
      }

      const updatedData = {
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        description: req.body.description,
      };

      if (req.file) {
        updatedData.imageUrl = req.file.path;
      }

      const updated = await Product.findByIdAndUpdate(req.params.id, updatedData, {
        new: true,
      });

      res.json(updated);
    } catch (error) {
      console.error("Errore nell'aggiornamento del prodotto:", error);
      res.status(500).json({ error: "Errore interno del server" });
    }
  }
);

// ✅ ELIMINA PRODOTTO
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Prodotto non trovato" });

    if (product.seller.toString() !== req.user.id)
      return res.status(403).json({ message: "Non autorizzato a cancellare questo prodotto" });

    await product.deleteOne();
    res.json({ message: "Prodotto eliminato con successo" });
  } catch (err) {
    res.status(500).json({ message: "Errore durante l'eliminazione" });
  }
});

// ✅ GET TUTTI I PRODOTTI
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "username");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Errore nel recupero prodotti" });
  }
});

// ✅ GET SINGOLO PRODOTTO
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("seller", "username email");
    if (!product) return res.status(404).json({ message: "Prodotto non trovato" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Errore interno server durante la ricerca prodotto", error: err.message });
  }
});

module.exports = router;
