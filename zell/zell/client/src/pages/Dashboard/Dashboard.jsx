import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Store, Package, FileText, ShoppingCart, DollarSign } from 'lucide-react';
import DashboardMetrics from './DashboardMetrics';
import StorefrontEditor from './StorefrontEditor';
import ProductManager from './ProductManager';
import LedgerView from './LedgerView';
import OrderQueue from './OrderQueue';
import StripeWizard from './StripeWizard';
import './Dashboard.css';

const Dashboard = () => {
  const location = useLocation();

  return (
    <div className="dashboard-layout fade-slide-enter-active">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h3>Vendor Panel</h3>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
            <Store size={18} /> Storefront
          </Link>
          <Link to="/dashboard/products" className={`nav-link ${location.pathname.includes('/products') ? 'active' : ''}`}>
            <Package size={18} /> Products
          </Link>
          <Link to="/dashboard/orders" className={`nav-link ${location.pathname.includes('/orders') ? 'active' : ''}`}>
            <ShoppingCart size={18} /> Orders
          </Link>
          <Link to="/dashboard/ledger" className={`nav-link ${location.pathname.includes('/ledger') ? 'active' : ''}`}>
            <FileText size={18} /> Ledger
          </Link>
          <Link to="/dashboard/payouts" className={`nav-link ${location.pathname.includes('/payouts') ? 'active' : ''}`}>
            <DollarSign size={18} /> Payout Settings
          </Link>
        </nav>
      </aside>
      
      <main className="dashboard-content">
        <DashboardMetrics />
        <Routes>
          <Route path="/" element={<StorefrontEditor />} />
          <Route path="/products" element={<ProductManager />} />
          <Route path="/orders" element={<OrderQueue />} />
          <Route path="/ledger" element={<LedgerView />} />
          <Route path="/payouts" element={<StripeWizard />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
