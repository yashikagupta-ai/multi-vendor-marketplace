import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { useAuth } from '../../store/useAuth';
import './Auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [error, setError] = useState('');
  const login = useAuth(state => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (res.ok) {
        login(data, data.token);
        navigate(data.role === 'vendor' ? '/dashboard' : '/');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration Fetch Error:', err);
      setError('Connection to server failed. Please check if the backend is running on port 5000.');
    }
  };

  return (
    <div className="auth-page fade-slide-enter-active">
      <Card className="auth-card">
        <h2>Create an Account</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" required className="input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" required className="input" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" required className="input" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label>I want to...</label>
            <select className="input" value={role} onChange={e => setRole(e.target.value)}>
              <option value="buyer">Shop</option>
              <option value="vendor">Sell (Become a Vendor)</option>
            </select>
          </div>
          <Button className="auth-btn" type="submit">Sign Up</Button>
        </form>
        <p className="auth-footer">Already have an account? <Link to="/login">Log in</Link></p>
      </Card>
    </div>
  );
};

export default Register;
