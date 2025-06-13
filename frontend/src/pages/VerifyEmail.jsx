// src/pages/VerifyEmail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifica in corso...");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/auth/verify-email/${token}`);
        const data = await res.json();
        setMessage(data.message || "Email verificata con successo!");
      } catch (error) {
        setMessage("Si è verificato un errore durante la verifica.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 text-center p-4">
      <div className="bg-white shadow-xl rounded-xl p-8 text-xl text-green-700 font-semibold">
        {message}
      </div>
    </div>
  );
};

export default VerifyEmail;
