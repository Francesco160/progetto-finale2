import { useEffect, useState, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaCartPlus, FaHeart } from "react-icons/fa";
import "../styles/Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/products")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore nel caricamento prodotti", err);
        setLoading(false);
      });
  }, []);

  const showTimedAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2500);
  };

  const handleAddToCart = async (productId) => {
    try {
      await axios.post(
        "http://localhost:3001/api/cart",
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showTimedAlert("Aggiunto al carrello! 🛒");
    } catch (err) {
      showTimedAlert("Errore nell'aggiunta al carrello ❌");
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      await axios.post(
        "http://localhost:3001/api/wishlist",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showTimedAlert("Aggiunto alla wishlist! 💖");
    } catch (err) {
      showTimedAlert("Errore nell'aggiunta alla wishlist ❌");
    }
  };

  if (loading) {
    return (
      <div className="home-loader">
        <Spinner animation="border" variant="info" />
      </div>
    );
  }

  return (
    <Container className="home-container mt-5">
      <h1 className="home-title">Benvenuto nel nostro shop!</h1>

      {showAlert && (
        <Alert className="custom-alert text-center mt-4">{alertMessage}</Alert>
      )}

      <Row className="g-4 mt-3">
        {products.map((product) => (
          <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
            <Card className="home-card h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={product.imageUrl}
                alt={product.name}
                className="home-img"
              />
              <Card.Body>
                <Card.Title className="home-product-title">{product.name}</Card.Title>
                <Card.Text className="text-muted">{product.category}</Card.Text>
                <Card.Text className="fw-bold">€{product.price}</Card.Text>
                <div className="d-flex justify-content-between">
                  <Button
                    variant="outline-success"
                    onClick={() => handleAddToCart(product._id)}
                  >
                    <FaCartPlus /> Carrello
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => handleAddToWishlist(product._id)}
                  >
                    <FaHeart /> Wishlist
                  </Button>
                </div>
                <Button
                  variant="info"
                  className="mt-2 w-100"
                  onClick={() => navigate(`/products/${product._id}`)}
                >
                  Dettagli
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;
