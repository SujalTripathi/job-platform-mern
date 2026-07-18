import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('jobseeker');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ name, email, password, role });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="glass-panel" style={{ padding: 40, width: '100%', maxWidth: 400 }}>
        <h2 className="header-title" style={{ textAlign: 'center', marginBottom: 30, fontSize: 28, fontWeight: 600 }}>Register</h2>
        
        {error && (
          <div style={{ background: '#dc3545', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 20 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ color: '#d4d4d4', display: 'block', marginBottom: 8 }}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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

          <div style={{ marginBottom: 20 }}>
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

          <div style={{ marginBottom: 30 }}>
            <label style={{ color: '#d4d4d4', display: 'block', marginBottom: 8 }}>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-select"
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                fontSize: 16
              }}
            >
              <option value="jobseeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
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
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#a3a3a3' }}>
          Already have an account? <Link to="/login" style={{ color: '#fbbf24', textDecoration: 'none' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;