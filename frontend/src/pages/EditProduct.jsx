import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Form, Button, Container, Spinner, Image } from "react-bootstrap";
import "../styles/Home.css";

const EditProduct = () => {
  const { productId } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newImage, setNewImage] = useState(null);

  const showAlert = (message, icon = "✅") => {
    const alert = document.createElement("div");
    alert.className = "custom-alert";
    alert.innerHTML = `${icon} ${message}`;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/products/${productId}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => {
        showAlert("Errore nel caricamento del prodotto", "❌");
        setLoading(false);
      });
  }, [productId]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setUpdating(true);

  try {
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("category", product.category);
    formData.append("price", product.price);
    formData.append("description", product.description);
   if (newImage) {
  formData.append("image", newImage);
}


    await axios.put(
      `http://localhost:3001/api/products/${productId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    showAlert("Prodotto aggiornato con successo!", "✏️");
    setTimeout(() => navigate("/"), 1000);
  } catch (err) {
    console.error(err.response?.data || err.message);
    showAlert("Errore nell'aggiornamento", "❌");
  } finally {
    setUpdating(false);
  }
};


  if (loading || !product) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" variant="info" />
      </div>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="text-electric-blue mb-4">Modifica prodotto</h2>
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group className="mb-3">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
  <Form.Label>Categoria</Form.Label>
  <Form.Select
    name="category"
    value={product.category}
    onChange={handleChange}
    required
  >
    <option value="Fumetti">Fumetti</option>
    <option value="Carte collezionabili">Carte collezionabili</option>
    <option value="Action figure">Action figure</option>
  </Form.Select>
</Form.Group>


        <Form.Group className="mb-3">
          <Form.Label>Prezzo</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Descrizione</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={product.description}
            onChange={handleChange}
          />
        </Form.Group>


        <Button variant="primary" type="submit" disabled={updating} className="w-100">
          {updating ? "Aggiornamento..." : "Aggiorna prodotto"}
        </Button>
      </Form>
    </Container>
  );
};

export default EditProduct;
