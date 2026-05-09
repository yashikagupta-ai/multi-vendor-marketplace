import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { useAuth } from '../../store/useAuth';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuth(state => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        login(data, data.token);
        navigate(data.role === 'vendor' ? '/dashboard' : (data.role === 'admin' ? '/admin' : '/'));
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-page fade-slide-enter-active">
      <Card className="auth-card">
        <h2>Welcome Back</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" required className="input" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" required className="input" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <Button className="auth-btn" type="submit">Login</Button>
        </form>
        <p className="auth-footer">Don't have an account? <Link to="/register">Sign up</Link></p>
      </Card>
    </div>
  );
};

export default Login;
