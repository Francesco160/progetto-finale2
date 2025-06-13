const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ["Fumetti", "Carte collezionabili", "Action figure"],
    required: true,
  },
  imageUrl: {
    type: String,
  },
  stock: {
    type: Number,
    default: 0,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  condition: {
    type: String,
    enum: ["nuovo", "usato", "ottime condizioni", "buone condizioni", "da restaurare"],
    default: "nuovo",
  },
  releaseDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
 

});

module.exports = mongoose.model("Product", productSchema);
