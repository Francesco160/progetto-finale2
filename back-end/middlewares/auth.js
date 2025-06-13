const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token mancante" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ message: "Utente non trovato" });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token non valido", error: err.message });
  }
};

module.exports = verifyToken;
