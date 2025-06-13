import React from "react";
import { Link } from "react-router-dom";

const VerifySuccess = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>✅ Email verificata con successo!</h1>
      <p style={styles.text}>
        Ora puoi effettuare il login al tuo account.
      </p>
      <Link to="/login" style={styles.button}>
        Vai al Login
      </Link>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "28px",
    color: "green",
  },
  text: {
    fontSize: "18px",
    margin: "20px 0",
  },
  button: {
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px",
    fontSize: "16px",
  },
};

export default VerifySuccess;
