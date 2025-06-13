const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const { register, login, verifyEmail } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email/:token", verifyEmail);

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utente non trovato" });

    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 ora
    await user.save();

    const link = `http://localhost:3001/reset-password/${token}`; 

    await sendEmail({
      to: user.email,
      subject: "Reset password",
      html: `<p>Clicca qui per reimpostare la password: <a href="${link}">${link}</a></p>`,
    });

    res.json({ message: "Email inviata" });
  } catch (err) {
    res.status(500).json({ message: "Errore server", error: err.message });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Token non valido o scaduto" });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reimpostata con successo" });
  } catch (err) {
    res.status(500).json({ message: "Errore server", error: err.message });
  }
});

router.get("/verify-email/:token", async (req, res) => {
  const { token } = req.params;

  console.log("🔍 Token ricevuto:", token);

  try {
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (user) {
      user.isVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();
      console.log("✅ Email verificata per:", user.email);
    } else {
      console.log("❌ Token non valido o scaduto");
    }

    // ✅ Reindirizza SEMPRE alla stessa pagina
    res.redirect("http://localhost:5173/verify-success");
  } catch (err) {
    console.error("❌ Errore server:", err.message);
    // anche in caso di errore: redirect
    res.redirect("http://localhost:5173/verify-success");
  }
});

// Rotta per diventare venditore
router.put("/become-seller", verifyToken, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) return res.status(404).json({ message: "Utente non trovato" });

  if (user.role === "seller") {
    return res.status(400).json({ message: "Sei già un venditore." });
  }

  try {
    user.role = "seller";
    await user.save();
    res.json({ message: "Ora sei un venditore!" });
  } catch (err) {
    res.status(500).json({ message: "Errore aggiornamento ruolo", error: err.message });
  }
});


module.exports = router;
