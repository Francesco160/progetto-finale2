import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // se usi un context
import axios from "axios";

const BecomeSellerButton = () => {
  const { user, token, setUser } = useContext(AuthContext); // cambia secondo il tuo contesto

  const handleBecomeSeller = async () => {
    try {
      const res = await axios.put(
        "http://localhost:3001/api/auth/become-seller",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(res.data.message);
      // 🔄 Se vuoi aggiornare lo stato utente nel contesto
      setUser({ ...user, role: "seller" });
    } catch (err) {
      alert(err.response?.data?.message || "Errore");
    }
  };

  if (user.role === "seller") return <p>Sei già un venditore</p>;

  return (
    <button onClick={handleBecomeSeller} className="btn btn-primary">
      Diventa venditore
    </button>
  );
};

export default BecomeSellerButton;
