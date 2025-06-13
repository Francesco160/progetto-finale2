import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate} from "react-router-dom";

import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import "../styles/Wishlist.css";
import { FaHeartBroken } from "react-icons/fa";

const Wishlist = () => {
  const { token } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const goToProduct = (productId) => {
  navigate(`/products/${productId}`);
};


  const fetchWishlist = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(res.data);
    } catch (err) {
      setError("Errore durante il caricamento della wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`http://localhost:3001/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
    } catch {
      setError("Errore nella rimozione del prodotto");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);
  useEffect(() => {
  console.log("Wishlist:", wishlist);
}, [wishlist]);

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="info" /></div>;
  if (error) return <Alert variant="danger" className="mt-5 text-center">{error}</Alert>;

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h1 className="wishlist-title">La tua Wishlist 💖</h1>
        <p className="wishlist-subtitle">I tuoi articoli preferiti, sempre a portata di mano.</p>
      </div>
      <Container className="wishlist-items mt-4">
        <Row xs={1} md={2} lg={3} className="g-4">
          {wishlist.map((product) => (
            <Col key={product._id}>
  <Card className="h-100 d-flex flex-column wishlist-card shadow">
    <Card.Img
      variant="top"
      src={product.imageUrl}
      alt={product.name}
      className="wishlist-img"
    />
    <Card.Body className="d-flex flex-column flex-grow-1">
      <div className="mb-3">
        <Card.Title className="wishlist-card-title">{product.name}</Card.Title>
        <Card.Text className="wishlist-card-price">€{product.price}</Card.Text>
      </div>

      <div className="mt-auto d-flex gap-2">
        <Button
  variant="outline-primary"
  onClick={() => goToProduct(product._id)}
  className="w-50"
>
  Vai al prodotto
</Button>

        <Button
          variant="danger"
          onClick={() => handleRemove(product._id)}
          className="w-50"
        >
          <FaHeartBroken /> Rimuovi
        </Button>
      </div>
    </Card.Body>
  </Card>
</Col>


          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Wishlist;
