import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/useAuth';
import { useCart } from '../../store/useCart';
import { useWishlist } from '../../store/useWishlist';
import { ShoppingBag, User, LogOut, Search as SearchIcon, Heart, LayoutDashboard, Package } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const items = useCart(state => state.items);
  const { user, isAuthenticated, logout, token } = useAuth();
  const { productIds, fetchWishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchWishlist(token);
    }
  }, [isAuthenticated, token, fetchWishlist]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isVendorPath = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');
  const isBuyer = !user || user.role === 'buyer';

  return (
    <nav className={`navbar ${isVendorPath ? 'vendor-navbar' : ''}`}>
      <div className="container navbar-inner">
        <Link to={user?.role === 'vendor' ? '/dashboard' : '/'} className="navbar-brand">Zell.</Link>

        <div className="nav-actions">
          {/* Only show Search, Wishlist, Cart for Buyers or Guests */}
          {isBuyer && !isVendorPath && (
            <>
              <Link to="/search" className="nav-icon" title="Search"><SearchIcon size={20} /></Link>
              <Link to="/my-orders" className="nav-icon" title="My Orders"><Package size={20} /></Link>
              <Link to="/wishlist" className="nav-icon wishlist-icon-wrapper" title="Wishlist">
                <Heart size={20} />
                {isAuthenticated && productIds.length > 0 && <span className="wishlist-count">{productIds.length}</span>}
              </Link>
              <Link to="/cart" className="nav-icon" title="Cart">
                <ShoppingBag size={20} />
                {items.length > 0 && <span className="cart-count">{items.length}</span>}
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <div className="user-menu-wrapper">
              {(user?.role === 'vendor' || user?.role === 'admin') && (
                <Link to={user.role === 'vendor' ? '/dashboard' : '/admin'} className="nav-icon" title="Dashboard">
                  <LayoutDashboard size={20} />
                </Link>
              )}
              
              <Link to="/profile" className="nav-icon user-avatar" title="My Profile">
                <User size={20} />
              </Link>

              <button className="nav-icon logout-btn" onClick={handleLogout} title="Logout">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-link">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
