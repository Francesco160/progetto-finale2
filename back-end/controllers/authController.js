const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Credenziali non valide" });

    // Controlla se l'utente è verificato
    if (!user.isVerified) {
      return res.status(401).json({ message: "Verifica la tua email prima di accedere" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Credenziali non valide" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user: { id: user._id, email: user.email, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: "Errore server", error: err.message });
  }
};


const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Controlla se l'utente esiste già
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email già registrata" });
    }

    // Crea token di verifica
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Hash della password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
  username,
  email,
  password: hashedPassword,
  isVerified: false,
  emailVerificationToken: verificationToken, 
  emailVerificationExpires: Date.now() + 3600000, 
});

    await newUser.save();

    // Invia email di verifica
   const verifyLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;


    await sendEmail({
      to: newUser.email,
      subject: "Conferma la tua email",
      html: `<p>Clicca qui per verificare il tuo account: <a href="${verifyLink}">${verifyLink}</a></p>`,
    });

    res.status(201).json({ message: "Registrazione effettuata. Controlla la tua email per confermare." });
  } catch (err) {
    res.status(500).json({ message: "Errore server", error: err.message });
  }
};


const verifyEmail = async (req, res) => {
  const { token } = req.params;
  console.log("🔍 Token ricevuto:", token); // ✅ Step 1

  try {
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log("❌ Nessun utente trovato o token scaduto");
      return res.status(400).json({ message: "email verificata con successo" });
    }

    console.log("✅ Utente trovato:", user.email); // ✅ Step 2

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    console.log("✅ Email verificata per:", user.email); // ✅ Step 3

    res.status(200).json({ message: "Email verificata con successo" });
  } catch (err) {
    console.error("❗ Errore nella verifica:", err.message);
    res.status(500).json({ message: "Errore server", error: err.message });
  }
};



module.exports = { register, login, verifyEmail };
