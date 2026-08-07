import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  Users, CheckCircle2, ShieldAlert,
  Search, FileSignature, LogOut, ArrowRight
} from 'lucide-react';

const OfficerDashboard = () => {
  const [stats, setStats] = useState({
    totalPending: 0,
    todayReviews: 0,
    flaggedCases: 0,
    approvedToday: 0
  });
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();
  const user = api.getCurrentUser();

  useEffect(() => {
    if (!user || user.role !== 'OFFICER') {
      navigate('/');
      return;
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await api.getOfficerDashboard();
      setStats(data.stats);
      setApplications(data.applications);
    } catch (err) {
      console.error(err);
      alert('Failed to load officer dashboard data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    navigate('/');
  };

  const getRiskBadge = (score) => {
    if (score >= 0.6) {
      return <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'rgba(244,63,94,0.1)', color: 'var(--accent-rose)' }}>High Risk ({score})</span>;
    }
    if (score > 0) {
      return <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'rgba(249,115,22,0.1)', color: 'var(--accent-saffron)' }}>Med Risk ({score})</span>;
    }
    return <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--accent-emerald)' }}>Low Risk</span>;
  };

  const getAiBadge = (recommendation) => {
    if (recommendation === 'APPROVE') {
      return <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>Approve</span>;
    }
    if (recommendation === 'REJECT') {
      return <span style={{ color: 'var(--accent-rose)', fontWeight: 700 }}>Reject</span>;
    }
    return <span style={{ color: 'var(--accent-saffron)', fontWeight: 700 }}>Review (Info)</span>;
  };

  const filteredApps = applications.filter(app => 
    app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.scholarshipTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', fontSize: '1.25rem' }}>Loading Dashboard...</div>;
  }

  return (
    <div className="container animate-slide-in" style={{ padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800 }}>
            Officer Verification Portal
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome, <strong>{user?.name}</strong></p>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary flex-center">
          <LogOut size={16} style={{ marginRight: '0.5rem' }} />
          Sign Out
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: 'var(--accent-blue)', padding: '1rem', borderRadius: '12px' }}>
            <Users size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase' }}>Pending Review</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.totalPending} Cases</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ backgroundColor: 'rgba(249,115,22,0.1)', color: 'var(--accent-saffron)', padding: '1rem', borderRadius: '12px' }}>
            <FileSignature size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase' }}>Today's Reviews</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.todayReviews} Cases</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ backgroundColor: 'rgba(244,63,94,0.1)', color: 'var(--accent-rose)', padding: '1rem', borderRadius: '12px' }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase' }}>Flagged Risks</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.flaggedCases} Cases</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--accent-emerald)', padding: '1rem', borderRadius: '12px' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase' }}>Approved Today</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.approvedToday} Cases</h3>
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search by student name, reference ID, or scholarship scheme..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Queue Table */}
      <div className="glass-panel" style={{ overflowX: 'auto', padding: '1.5rem' }}>
        {filteredApps.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>
            No applications match your search query.
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-card)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                <th style={{ padding: '0.75rem 1rem' }}>Applicant</th>
                <th style={{ padding: '0.75rem 1rem' }}>Scholarship Scheme</th>
                <th style={{ padding: '0.75rem 1rem' }}>CGPA</th>
                <th style={{ padding: '0.75rem 1rem' }}>Family Income</th>
                <th style={{ padding: '0.75rem 1rem' }}>AI Recommendation</th>
                <th style={{ padding: '0.75rem 1rem' }}>Fraud Scan</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => (
                <tr key={app.id} style={{ borderBottom: '1px solid var(--border-card)', transition: 'background-color 0.15s ease' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 700 }}>{app.studentName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: {app.id.substring(0, 8).toUpperCase()}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div>{app.scholarshipTitle}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Amount: ₹{app.amount.toLocaleString()}</div>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{app.cgpa}</td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>₹{app.annualIncome.toLocaleString()}</td>
                  <td style={{ padding: '1rem' }}>{getAiBadge(app.aiRecommendation)}</td>
                  <td style={{ padding: '1rem' }}>{getRiskBadge(app.fraudRiskScore)}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                      backgroundColor: app.status === 'APPROVED' ? 'rgba(16,185,129,0.1)' : app.status === 'REJECTED' ? 'rgba(244,63,94,0.1)' : 'rgba(249,115,22,0.1)',
                      color: app.status === 'APPROVED' ? 'var(--accent-emerald)' : app.status === 'REJECTED' ? 'var(--accent-rose)' : 'var(--accent-saffron)'
                    }}>
                      {app.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => navigate(`/reviewer/${app.id}`)}
                      className="btn btn-secondary flex-center"
                      style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem', display: 'inline-flex' }}
                    >
                      Audit
                      <ArrowRight size={14} style={{ marginLeft: '0.375rem' }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OfficerDashboard;
