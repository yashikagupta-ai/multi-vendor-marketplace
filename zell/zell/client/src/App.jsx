import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home/Home';
import VendorShop from './pages/VendorShop/VendorShop';
import Checkout from './pages/Checkout/Checkout';
import Dashboard from './pages/Dashboard/Dashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import OrderTimeline from './pages/Orders/OrderTimeline';
import Search from './pages/Search/Search';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import CategoryPage from './pages/Category/CategoryPage';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Wishlist from './pages/Wishlist/Wishlist';
import Profile from './pages/Profile/Profile';
import CartPage from './pages/Cart/CartPage';
import Navbar from './components/Navbar/Navbar';
import { Toast } from './components/Toast/Toast';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-transition">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/shop/:slug" element={<VendorShop />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/my-orders" element={<OrderTimeline />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <AnimatedRoutes />
      </main>
      <Toast />
    </Router>
  );
}

export default App;
