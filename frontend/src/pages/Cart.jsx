import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Container, Spinner, Alert } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import "../styles/Cart.css"; // Assuming you have some custom styles

const Cart = () => {
  const { token } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/cart", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(res.data);
    } catch {
      setError("Errore nel caricamento del carrello");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`http://localhost:3001/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(cartItems.filter(item => item.productId._id !== productId));
    } catch {
      alert("Errore nella rimozione del prodotto");
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.productId.price * item.quantity, 0
  );

  if (loading) return <div className="spinner-container"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger" className="mt-4">{error}</Alert>;
  if (cartItems.length === 0) return (
    <Container className="empty-cart text-center">
      <h2 className="text-electric-blue">Il carrello è vuoto</h2>
      <p className="text-electric-blue">Aggiungi qualche prodotto per iniziare lo shopping!</p>
    </Container>
  );

  return (
    <Container className="cart-container">
      <h2 className="cart-title text-electric-blue">Il tuo carrello</h2>
      {cartItems.map(({ productId, quantity }) => (
        <div key={productId._id} className="cart-card shadow-sm">
          <button 
            className="remove-btn" 
            onClick={() => handleRemove(productId._id)} 
            aria-label="Rimuovi prodotto"
          >
            &times;
          </button>
          <div className="cart-content">
            <img src={productId.imageUrl} alt={productId.name} className="cart-image" />
            <div className="cart-info">
              <h3 className="cart-product-name text-electric-blue">{productId.name}</h3>
              <p className="cart-product-detail price">
                Prezzo unitario: <strong>€{productId.price.toFixed(2)}</strong>
                     </p>
                   <p className="cart-product-detail quantity">
                   Quantità: <strong>{quantity}</strong>
                </p>
                 <p className="cart-product-detail subtotal">
      Subtotale: <strong>€{(productId.price * quantity).toFixed(2)}</strong>
  </p>

            </div>
          </div>
        </div>
      ))}

      <div className="cart-footer">
        <h4 className="cart-total cart-product-detail price">Totale: €{totalPrice.toFixed(2)}</h4>
        <button className="checkout-btn" disabled>
          Procedi al pagamento
        </button>
      </div>
    </Container>
  );
};

export default Cart;
