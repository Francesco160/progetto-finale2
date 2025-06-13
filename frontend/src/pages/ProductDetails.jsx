import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Card, Button, Row, Col, Spinner, Badge } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import "../styles/ProductDetails.css";

const showAlert = (message, icon = "✅") => {
  const alert = document.createElement("div");
  alert.className = "custom-alert";
  alert.innerHTML = `${icon} ${message}`;
  document.body.appendChild(alert);
  setTimeout(() => {
    alert.remove();
  }, 3000);
};

const ProductDetails = () => {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) {
    return (
      <div className="spinner-wrapper">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const isSeller = user?.id === product.seller?._id;

  const handleDelete = async () => {
    if (window.confirm("Sei sicuro di voler eliminare questo prodotto?")) {
      try {
        await axios.delete(`http://localhost:3001/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showAlert("Prodotto eliminato", "✅");
        navigate("/");
      } catch (err) {
        showAlert("Errore nell'eliminazione", "❌");
      }
    }
  };

  const handleAddToCart = async () => {
    try {
      await axios.post(
        "http://localhost:3001/api/cart",
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showAlert("Aggiunto al carrello");
    } catch (err) {
      showAlert("Errore nell'aggiunta al carrello");
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await axios.post(
        "http://localhost:3001/api/wishlist",
        { productId: product._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showAlert("Aggiunto alla wishlist");
    } catch (err) {
      showAlert("Errore nell'aggiunta alla wishlist");
    }
  };

  return (
    <Container className="product-details-container">
      <Card className="product-card-elegant shadow-sm">
        <Row>
          <Col md={5}>
            <Card.Img variant="top" src={product.imageUrl} className="product-img" />
          </Col>
          <Col md={7}>
            <Card.Body>
              <Card.Title className="product-title">{product.name}</Card.Title>
              <Card.Text className="product-price">€{product.price}</Card.Text>
              <div className="mb-2">
                <Badge bg="light" text="dark" className="me-2">
                  {product.category}
                </Badge>
                <Badge bg="info" text="white">{product.condition}</Badge>
              </div>
              <Card.Text className="product-description">{product.description}</Card.Text>
              <Card.Text className="text-muted">
                Inserito il {new Date(product.createdAt).toLocaleDateString()}
              </Card.Text>

              <div className="action-buttons mt-3">
                {isSeller ? (
                  <>
                    <Button variant="outline-warning" size="sm" onClick={() => navigate(`/products/edit/${product._id}`)}>
                      Modifica
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={handleDelete}>
                      Elimina
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="primary" size="sm" onClick={handleAddToCart}>
                      🛒 Aggiungi al carrello
                    </Button>
                    <Button variant="outline-secondary" size="sm" onClick={handleAddToWishlist}>
                      ❤️ Wishlist
                    </Button>
                  </>
                )}
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default ProductDetails;
