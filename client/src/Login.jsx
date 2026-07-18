import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="glass-panel" style={{ padding: 40, width: '100%', maxWidth: 400 }}>
        <h2 className="header-title" style={{ textAlign: 'center', marginBottom: 30, fontSize: 28, fontWeight: 600 }}>Login</h2>
        
        {error && (
          <div style={{ background: '#dc3545', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 20 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ color: '#d4d4d4', display: 'block', marginBottom: 8 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                fontSize: 16
              }}
            />
          </div>

          <div style={{ marginBottom: 30 }}>
            <label style={{ color: '#d4d4d4', display: 'block', marginBottom: 8 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                fontSize: 16
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: 14,
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#a3a3a3' }}>
          Don't have an account? <Link to="/register" style={{ color: '#fbbf24', textDecoration: 'none' }}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;