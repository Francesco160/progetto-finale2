import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import "../styles/Home.css";


const showAlert = (message, icon = "✅") => {
  const alert = document.createElement("div");
  alert.className = "custom-alert";
  alert.innerHTML = `${icon} ${message}`;
  document.body.appendChild(alert);
  setTimeout(() => {
    alert.remove();
  }, 3000);
};


const SellProduct = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Fumetti",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) return alert("Carica un'immagine");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("image", formData.image);

    try {
      await axios.post("http://localhost:3001/api/products", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      showAlert("Prodotto caricato con successo ✅");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      showAlert(err.response?.data?.message || "Errore nel caricamento", "❌");
    }
  };

  return (
    <Container className="login-container">
      <h2 className="mb-4 label-blue">Metti in vendita un prodotto</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className="label-blue">Nome</Form.Label>
          <Form.Control name="name" value={formData.name} onChange={handleChange} required className="login-input" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="label-blue">Descrizione</Form.Label>
          <Form.Control
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            as="textarea"
            rows={3}
            className="login-input"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="label-blue">Prezzo</Form.Label>
          <Form.Control
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
            className="login-input"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="label-blue">Categoria</Form.Label>
          <Form.Select name="category" value={formData.category} onChange={handleChange} className="login-input">
            <option value="Fumetti">Fumetti</option>
            <option value="Carte collezionabili">Carte collezionabili</option>
            <option value="Action figure">Action figure</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="label-blue">Immagine</Form.Label>
          <Form.Control name="image" type="file" accept="image/*" onChange={handleChange} className="login-input" />
        </Form.Group>

        <Button type="submit" className="btn-login w-100">Carica prodotto</Button>
      </Form>
    </Container>
  );
};

export default SellProduct;
