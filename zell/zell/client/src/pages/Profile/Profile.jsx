import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/useAuth';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import './Profile.css';

const Profile = () => {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
    bankAccount: '',
    ifscCode: '',
    bankName: ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    // Fetch latest user data
    if (token) {
      fetch('http://localhost:5000/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.profile?.phone || '',
          bankAccount: data.vendorData?.bankAccount || '',
          ifscCode: data.vendorData?.ifscCode || '',
          bankName: data.vendorData?.bankName || ''
        });
      })
      .catch(console.error);
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMsg({ type: 'error', text: data.message || 'Update failed' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Connection error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page container fade-slide-enter-active">
      <header className="profile-header">
        <h1>Account Settings</h1>
        <p>Manage your personal details and account preferences.</p>
      </header>

      <div className="profile-grid">
        <aside className="profile-nav-sidebar">
          <Card className="profile-mini-card">
            <div className="avatar-placeholder">{formData.name[0]}</div>
            <div className="mini-info">
              <h3>{formData.name}</h3>
              <span>{user?.role.toUpperCase()}</span>
            </div>
          </Card>
        </aside>

        <main className="profile-main-content">
          <Card className="profile-form-card">
            <form onSubmit={handleSubmit}>
              <section className="profile-section">
                <h3>Personal Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" name="email" value={formData.email} disabled />
                    <small>Email cannot be changed.</small>
                  </div>
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" name="phone" placeholder="+91 00000 00000" value={formData.phone} onChange={handleChange} />
                </div>
              </section>

              {user?.role === 'vendor' && (
                <section className="profile-section">
                  <h3>Payout & Bank Details</h3>
                  <p className="section-desc">Required for receiving payments from Zell Marketplace.</p>
                  <div className="form-group">
                    <label>Bank Account Number</label>
                    <input type="text" name="bankAccount" value={formData.bankAccount} onChange={handleChange} />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>IFSC Code</label>
                      <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>Bank Name</label>
                      <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} />
                    </div>
                  </div>
                </section>
              )}

              {msg.text && <div className={`profile-msg ${msg.type}`}>{msg.text}</div>}

              <div className="profile-actions">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Profile;
