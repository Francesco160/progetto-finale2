import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleBecomeSellerClick = () => {
    navigate("/become-seller");
  };

  const handleSellProductClick = () => {
    navigate("/sell-product"); // assicurati che questa route esista
  };

  return (
    <Navbar expand="lg" bg="dark" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand href="/">Il Mio Shop</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/">Home</Nav.Link>

            {user ? (
              <>
                <Nav.Link href="/wishlist">Wishlist</Nav.Link>
                <Nav.Link href="/cart">Carrello</Nav.Link>

                {/* Mostra opzione diversa a seconda del ruolo */}
                {user.role === "seller" || user.role === "admin" ? (
                  <Nav.Link onClick={handleSellProductClick}>
                    Vendi un prodotto
                  </Nav.Link>
                ) : (
                  <Nav.Link onClick={handleBecomeSellerClick}>
                    Diventa venditore
                  </Nav.Link>
                )}

                <NavDropdown title={user.username} id="user-dropdown" align="end">
                  <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/register">Registrati</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
