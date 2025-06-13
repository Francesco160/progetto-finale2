import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const BecomeSeller = () => {
  const { user, token, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!user) {
    return <p>Devi essere loggato per diventare venditore.</p>;
  }

  if (user.role === "seller") {
    return <p>Sei diventato venditore!.</p>;
  }

  const handleBecomeSeller = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.put(
        "http://localhost:3001/api/auth/become-seller",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(res.data.message || "Sei diventato venditore!");
      // Aggiorna il ruolo in AuthContext
      setUser({ ...user, role: "seller" });
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Errore durante la richiesta."
      );
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
      <h2>Diventa venditore</h2>
      <p>Clicca il pulsante per diventare venditore e iniziare a mettere in vendita i tuoi prodotti.</p>
      <button
        onClick={handleBecomeSeller}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? "Caricamento..." : "Diventa venditore"}
      </button>
      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
};

export default BecomeSeller;
