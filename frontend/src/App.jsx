import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavbar from './components/Navbar';


import Home from './pages/Home';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import VerifySuccess from "./pages/VerifySuccess";
import BecomeSellerPage from './pages/BecomeSellerPage';
import SellProduct from './pages/SellProduct';
import ProductsDetails from './pages/ProductDetails';
import EditProduct from './pages/EditProduct';

function App() {
  return (
    <>
      <MyNavbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/products/:id" element={<ProductsDetails />} />
<Route path="/products/edit/:productId" element={<EditProduct />} />

          <Route path="/sell-product" element={<SellProduct />} />
          <Route path="/become-seller" element={<BecomeSellerPage />} />
          <Route path="/verify-success" element={<VerifySuccess />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/" element={<Home />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
