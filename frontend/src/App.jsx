import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import ApplyScholarship from './pages/ApplyScholarship';
import Submitted from './pages/Submitted';
import OfficerDashboard from './pages/OfficerDashboard';
import OfficerReview from './pages/OfficerReview';
import { Sun, Moon, Cpu, ArrowRight, Menu, X } from 'lucide-react';

import { api } from './services/api';

const HeaderNav = ({ user, isDark, toggleTheme, handleSignOut }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="glass-panel" style={{
        margin: '1rem', padding: '0.875rem 1.75rem', borderRadius: '14px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: '0.75rem', zIndex: 10000,
        background: 'rgba(13, 19, 33, 0.92)',
        backdropFilter: 'blur(16px)'
      }}>
        {/* Brand & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
            <img
              src="/logo.jpg"
              alt="ScholarFlow AI Logo"
              style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <Cpu size={24} color="var(--accent-saffron)" style={{ display: 'none' }} />
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem',
              color: 'var(--text-primary)', letterSpacing: '-0.02em', display: 'inline-flex', alignItems: 'center', gap: '0.5rem'
            }}>
              <span>ScholarFlow <span style={{ color: 'var(--accent-saffron)' }}>AI</span></span>
            </span>
          </Link>
        </div>

        {/* Desktop Nav Links (Product, How It Works, About, Contact) */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }} className="desktop-nav">
          <button
            onClick={() => handleNavClick('product')}
            style={{
              background: 'none', border: 'none', color: 'var(--text-secondary)',
              fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer', outline: 'none',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
          >
            Product
          </button>

          <button
            onClick={() => handleNavClick('how-it-works')}
            style={{
              background: 'none', border: 'none', color: 'var(--text-secondary)',
              fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer', outline: 'none',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
          >
            How It Works
          </button>

          <button
            onClick={() => handleNavClick('about')}
            style={{
              background: 'none', border: 'none', color: 'var(--text-secondary)',
              fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer', outline: 'none',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
          >
            About
          </button>

          <button
            onClick={() => handleNavClick('team')}
            style={{
              background: 'none', border: 'none', color: 'var(--text-secondary)',
              fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer', outline: 'none',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
          >
            Team
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            style={{
              background: 'none', border: 'none', color: 'var(--text-secondary)',
              fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer', outline: 'none',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
          >
            Contact
          </button>
        </nav>

        {/* Right Controls: Theme Toggle, Try App Button & Mobile Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={toggleTheme}
            style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)',
              padding: '0.5rem', borderRadius: '8px', cursor: 'pointer',
              color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', outline: 'none'
            }}
            title="Toggle color theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="desktop-nav">
              <Link
                to={user.role === 'OFFICER' ? '/reviewer' : '/dashboard'}
                style={{
                  fontSize: '0.8125rem', fontWeight: 700, padding: '0.35rem 0.75rem', borderRadius: '6px',
                  backgroundColor: user.role === 'OFFICER' ? 'rgba(249,115,22,0.15)' : 'rgba(59,130,246,0.15)',
                  color: user.role === 'OFFICER' ? 'var(--accent-saffron)' : 'var(--accent-blue)',
                  textDecoration: 'none'
                }}
              >
                Dashboard ({user.name.split(' ')[0]})
              </Link>
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
            <button
              onClick={() => navigate('/login')}
              className="btn btn-primary desktop-nav"
              style={{
                padding: '0.55rem 1.15rem',
                fontSize: '0.875rem',
                borderRadius: '8px',
                boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              Try App <ArrowRight size={16} />
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-nav-toggle"
            style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)',
              padding: '0.5rem', borderRadius: '8px', cursor: 'pointer',
              color: 'var(--text-primary)', outline: 'none'
            }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <button
            onClick={() => handleNavClick('product')}
            style={{
              background: 'none', border: 'none', color: 'var(--text-primary)',
              fontSize: '1rem', fontWeight: 600, textAlign: 'left', cursor: 'pointer'
            }}
          >
            Product Features
          </button>
          <button
            onClick={() => handleNavClick('how-it-works')}
            style={{
              background: 'none', border: 'none', color: 'var(--text-primary)',
              fontSize: '1rem', fontWeight: 600, textAlign: 'left', cursor: 'pointer'
            }}
          >
            How It Works
          </button>
          <button
            onClick={() => handleNavClick('about')}
            style={{
              background: 'none', border: 'none', color: 'var(--text-primary)',
              fontSize: '1rem', fontWeight: 600, textAlign: 'left', cursor: 'pointer'
            }}
          >
            About System
          </button>
          <button
            onClick={() => handleNavClick('team')}
            style={{
              background: 'none', border: 'none', color: 'var(--text-primary)',
              fontSize: '1rem', fontWeight: 600, textAlign: 'left', cursor: 'pointer'
            }}
          >
            Our Team
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            style={{
              background: 'none', border: 'none', color: 'var(--text-primary)',
              fontSize: '1rem', fontWeight: 600, textAlign: 'left', cursor: 'pointer'
            }}
          >
            Feedback & Survey
          </button>

          <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-card)' }}>
            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link
                  to={user.role === 'OFFICER' ? '/reviewer' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary"
                  style={{ textDecoration: 'none', textAlign: 'center' }}
                >
                  Go to Dashboard ({user.name.split(' ')[0]})
                </Link>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleSignOut(); }}
                  className="btn btn-secondary"
                  style={{ color: 'var(--accent-rose)' }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                className="btn btn-primary"
                style={{ width: '100%', gap: '0.5rem' }}
              >
                Try App <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const AppContent = () => {
  const [user, setUser] = useState(api.getCurrentUser());
  const [isDark, setIsDark] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'ScholarFlow AI — Supporting Talents, Building Bharat';
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
      <HeaderNav
        user={user}
        isDark={isDark}
        toggleTheme={toggleTheme}
        handleSignOut={handleSignOut}
      />

      <main style={{ flex: 1, paddingBottom: '3rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLoginSuccess} />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/apply-scholarship" element={<ApplyScholarship />} />
          <Route path="/submitted" element={<Submitted />} />
          <Route path="/reviewer" element={<OfficerDashboard />} />
          <Route path="/reviewer/:id" element={<OfficerReview />} />
        </Routes>
      </main>

      <footer style={{
        textAlign: 'center', padding: '2rem 1.5rem', fontSize: '0.8125rem',
        color: 'var(--text-secondary)', borderTop: '1px solid var(--border-card)',
        margin: '2rem 1rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>
          ScholarFlow <span style={{ color: 'var(--accent-saffron)' }}>AI</span>
        </div>
        <p style={{ margin: 0 }}>
          © 2026 ScholarFlow AI. All rights reserved.
        </p>
        <p style={{ margin: 0 }}>
          Made with <span style={{ color: 'var(--accent-saffron)' }}>❤</span> For "A Digital and Smart India"
        </p>
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
