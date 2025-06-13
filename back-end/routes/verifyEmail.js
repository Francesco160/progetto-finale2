const express = require("express");
const router = express.Router();
const User = require("../models/User");

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
      // ⚠️ Non fare return, continua il flusso
    }

    // ✅ Redirect al frontend in ogni caso
    res.redirect("http://localhost:5173/verify-success");
  } catch (err) {
    console.error("❌ Errore server:", err.message);
    // Redirect anche in caso di errore
    res.redirect("http://localhost:5173/verify-success");
  }
});

module.exports = router;
