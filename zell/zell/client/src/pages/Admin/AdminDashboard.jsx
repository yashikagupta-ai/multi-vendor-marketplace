import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Users, AlertCircle, TrendingUp } from 'lucide-react';
import VendorApproval from './VendorApproval';
import DisputeMediation from './DisputeMediation';
import ReportsPage from './ReportsPage';

const AdminDashboard = () => {
  const location = useLocation();

  return (
    <div className="dashboard-layout fade-slide-enter-active">
      <aside className="dashboard-sidebar" style={{ backgroundColor: '#2C2C2A', color: '#F7F4EF' }}>
        <div className="sidebar-header" style={{ borderBottomColor: '#444' }}>
          <h3 style={{ color: '#F7F4EF' }}>Zell Admin</h3>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`} style={{ color: '#aaa' }}>
            <Users size={18} /> Vendors
          </Link>
          <Link to="/admin/disputes" className={`nav-link ${location.pathname.includes('/disputes') ? 'active' : ''}`} style={{ color: '#aaa' }}>
            <AlertCircle size={18} /> Disputes
          </Link>
          <Link to="/admin/reports" className={`nav-link ${location.pathname.includes('/reports') ? 'active' : ''}`} style={{ color: '#aaa' }}>
            <TrendingUp size={18} /> Reports
          </Link>
        </nav>
      </aside>
      
      <main className="dashboard-content">
        <Routes>
          <Route path="/" element={<VendorApproval />} />
          <Route path="/disputes" element={<DisputeMediation />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
