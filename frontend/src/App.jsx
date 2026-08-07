import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import ApplyScholarship from './pages/ApplyScholarship';
import Submitted from './pages/Submitted';
import OfficerDashboard from './pages/OfficerDashboard';
import OfficerReview from './pages/OfficerReview';
import { Sun, Moon, Cpu } from 'lucide-react';
import { api } from './services/api';

const AppContent = () => {
  const [user, setUser] = useState(api.getCurrentUser());
  const [isDark, setIsDark] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setUser(api.getCurrentUser());
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleSignOut = () => {
    api.logout();
    setUser(null);
    navigate('/');
  };

  const toggleTheme = () => {
    const body = document.body;
    if (isDark) {
      body.classList.add('light-theme');
    } else {
      body.classList.remove('light-theme');
    }
    setIsDark(!isDark);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="glass-panel" style={{
        margin: '1rem', padding: '1rem 1.5rem', borderRadius: '12px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: '1rem', zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Cpu size={24} color="var(--accent-saffron)" />
          <Link to={user ? (user.role === 'OFFICER' ? '/reviewer' : '/dashboard') : '/'} style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem',
            color: 'var(--text-primary)', textDecoration: 'none', letterSpacing: '-0.02em'
          }}>
            ScholarFlow <span style={{ color: 'var(--accent-saffron)' }}>AI</span>
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button
            onClick={toggleTheme}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', outline: 'none'
            }}
            title="Toggle color theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{
                fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.5rem', borderRadius: '4px',
                backgroundColor: user.role === 'OFFICER' ? 'rgba(249,115,22,0.1)' : 'rgba(59,130,246,0.1)',
                color: user.role === 'OFFICER' ? 'var(--accent-saffron)' : 'var(--accent-blue)'
              }}>
                {user.role} MODE
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                {user.name}
              </span>
              <button
                onClick={handleSignOut}
                style={{
                  background: 'none', border: 'none', color: 'var(--accent-rose)',
                  fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', outline: 'none'
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              AI Governance System v1.0
            </span>
          )}
        </div>
      </header>

      <main style={{ flex: 1, paddingBottom: '3rem' }}>
        <Routes>
          <Route path="/" element={<Login onLogin={handleLoginSuccess} />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/apply-scholarship" element={<ApplyScholarship />} />
          <Route path="/submitted" element={<Submitted />} />
          <Route path="/reviewer" element={<OfficerDashboard />} />
          <Route path="/reviewer/:id" element={<OfficerReview />} />
        </Routes>
      </main>

      <footer style={{
        textAlign: 'center', padding: '1.5rem', fontSize: '0.8125rem',
        color: 'var(--text-secondary)', borderTop: '1px solid var(--border-card)',
        margin: '2rem 1rem 1rem'
      }}>
        ScholarFlow AI © 2026. Real-time Multi-Agent Verification Platform. All rights reserved.
      </footer>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
