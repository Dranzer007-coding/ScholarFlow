import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { LogIn, User, ShieldCheck } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [isStudent, setIsStudent] = useState(true);
  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.search.includes('expired=1')) {
      setError('Your session has expired or your user account was updated. Please sign in again.');
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      let loginData;
      if (isRegister) {
        await api.register(name.trim(), cleanEmail, password, 'STUDENT');
        loginData = await api.login(cleanEmail, password);
      } else {
        loginData = await api.login(cleanEmail, password);
      }
      onLogin(loginData);

      // Route based on actual role returned by backend
      if (loginData?.role?.toUpperCase() === 'OFFICER') {
        navigate('/reviewer');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center animate-slide-in" style={{ minHeight: 'calc(100vh - 120px)' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="text-gradient" style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            ScholarFlow AI
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            End-to-End Scholarship Governance Platform
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: '0.25rem', borderRadius: '10px', border: '1px solid var(--border-card)', marginBottom: '1.5rem' }}>
          <button
            type="button"
            className="flex-center"
            style={{
              flex: 1,
              padding: '0.625rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.875rem',
              backgroundColor: isStudent ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: isStudent ? 'var(--text-primary)' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
            onClick={() => { setIsStudent(true); setIsRegister(false); setError(''); }}
          >
            <User size={16} style={{ marginRight: '0.5rem' }} />
            Student Portal
          </button>
          <button
            type="button"
            className="flex-center"
            style={{
              flex: 1,
              padding: '0.625rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.875rem',
              backgroundColor: !isStudent ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: !isStudent ? 'var(--text-primary)' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
            onClick={() => { setIsStudent(false); setIsRegister(false); setError(''); }}
          >
            <ShieldCheck size={16} style={{ marginRight: '0.5rem' }} />
            Officer Portal
          </button>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(244,63,94,0.1)', color: 'var(--accent-rose)', border: '1px solid rgba(244,63,94,0.2)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.25rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">{isStudent ? 'Student Email / ID' : 'Officer ID / Email'}</label>
            <input
              type="email"
              className="form-input"
              placeholder={isStudent ? 'Enter Student email-id' : 'Enter officer email-id'}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder={isStudent ? 'Enter Password' : 'Enter Password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary flex-center"
            style={{ width: '100%', padding: '0.875rem', marginTop: '0.75rem' }}
            disabled={loading}
          >
            <LogIn size={18} style={{ marginRight: '0.5rem' }} />
            {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Continue to Portal'}
          </button>
        </form>

        {isStudent && (
          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            </span>
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: 'var(--accent-saffron)', fontWeight: 600, cursor: 'pointer', outline: 'none' }}
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
            >
              {isRegister ? 'Log in here' : 'Register here'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
