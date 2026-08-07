import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  FileText, Award, Landmark, Eye, LogOut, ArrowRight
} from 'lucide-react';

const StudentDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  
  const user = api.getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const apps = await api.getStudentApplications();
      setApplications(apps);
      
      const notifs = await api.getNotifications();
      setNotifications(notifs);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    navigate('/');
  };

  const getStatusProgress = (status) => {
    switch (status) {
      case 'DRAFT': return { pct: 20, label: 'Draft' };
      case 'SUBMITTED':
      case 'DOCUMENT_VERIFICATION': return { pct: 45, label: 'Document Verification' };
      case 'ELIGIBILITY_CHECK':
      case 'FRAUD_DETECTION': return { pct: 65, label: 'AI Processing Checks' };
      case 'OFFICER_REVIEW': return { pct: 85, label: 'Pending Officer Review' };
      case 'APPROVED': return { pct: 100, label: 'Approved & Sanctioned' };
      case 'REJECTED': return { pct: 100, label: 'Rejected' };
      default: return { pct: 0, label: 'Unknown' };
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DRAFT': return <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>Draft</span>;
      case 'APPROVED': return <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--accent-emerald)' }}>Approved</span>;
      case 'REJECTED': return <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(244,63,94,0.1)', color: 'var(--accent-rose)' }}>Rejected</span>;
      default: return <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(249,115,22,0.1)', color: 'var(--accent-saffron)' }}>Under Review</span>;
    }
  };

  const activeCount = applications.length;
  const approvedTotal = applications
    .filter(a => a.status === 'APPROVED')
    .reduce((sum, a) => sum + (a.scholarship?.amount || 0), 0);
  
  const mockDocsUploaded = activeCount > 0 ? 3 : 0;

  const viewDetails = async (appId) => {
    try {
      const details = await api.getApplication(appId);
      setSelectedApp(details);
    } catch (error) {
      alert('Failed to retrieve application details: ' + error.message);
    }
  };

  const handleMarkNotifRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', fontSize: '1.25rem' }}>Loading Dashboard...</div>;
  }

  return (
    <div className="container animate-slide-in" style={{ padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800 }}>
            Good Afternoon, {user?.name} 👋
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome to your ScholarFlow applicant console.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/apply-scholarship')} className="btn btn-primary">
            Apply New Scheme
            <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
          </button>
          <button onClick={handleLogout} className="btn btn-secondary" title="Sign Out">
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* KPI stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: 'var(--accent-blue)', padding: '1rem', borderRadius: '12px' }}>
            <FileText size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Active Applications</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{activeCount} Scheme(s)</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ backgroundColor: 'rgba(249,115,22,0.1)', color: 'var(--accent-saffron)', padding: '1rem', borderRadius: '12px' }}>
            <Award size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Document Readiness</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{mockDocsUploaded} of 3 Loaded</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--accent-emerald)', padding: '1rem', borderRadius: '12px' }}>
            <Landmark size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Grants Received</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>₹{approvedTotal.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* History */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Your Application History
          </h3>
          {applications.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No applications submitted yet. Click "Apply New Scheme" above to begin your application.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {applications.map((app) => {
                const progress = getStatusProgress(app.status);
                return (
                  <div key={app.id} className="glass-panel glass-card-hover" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <h4 style={{ fontWeight: 700, fontSize: '1.125rem' }}>{app.scholarship?.title}</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                          App ID: {app.id.substring(0, 8).toUpperCase()} | Submitted: {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {getStatusBadge(app.status)}
                        <button onClick={() => viewDetails(app.id)} className="btn btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}>
                          <Eye size={14} style={{ marginRight: '0.375rem' }} />
                          Track
                        </button>
                      </div>
                    </div>

                    {/* Progress slider */}
                    <div style={{ marginTop: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>
                        <span>Workflow Stage: {progress.label}</span>
                        <span>{progress.pct}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${progress.pct}%`,
                          height: '100%',
                          background: app.status === 'REJECTED' ? 'var(--accent-rose)' : 'linear-gradient(90deg, var(--accent-blue), var(--accent-saffron))',
                          borderRadius: '3px',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Recent Updates
          </h3>
          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '450px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center', padding: '1.5rem 0' }}>
                No recent notifications.
              </p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  style={{
                    padding: '0.875rem',
                    borderRadius: '8px',
                    backgroundColor: notif.isRead ? 'rgba(255,255,255,0.01)' : 'rgba(59,130,246,0.05)',
                    borderLeft: `3px solid ${notif.isRead ? 'rgba(255,255,255,0.1)' : 'var(--accent-blue)'}`,
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <h5 style={{ fontWeight: 700, fontSize: '0.875rem', color: notif.isRead ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                      {notif.title}
                    </h5>
                    {!notif.isRead && (
                      <button
                        onClick={() => handleMarkNotifRead(notif.id)}
                        style={{ border: 'none', background: 'none', color: 'var(--accent-blue)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>{notif.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Details Modal Drawer */}
      {selectedApp && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', justifyContent: 'flex-end', zIndex: 1000
        }}>
          <div className="glass-panel animate-slide-in" style={{
            width: '100%', maxWidth: '640px', height: '100%', borderRadius: '0',
            borderLeft: '1px solid var(--border-card)', padding: '2.5rem',
            overflowY: 'auto', display: 'flex', flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800 }}>
                Application Journey Track
              </h3>
              <button
                onClick={() => setSelectedApp(null)}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 0.875rem' }}
              >
                Close
              </button>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ color: 'var(--accent-saffron)', fontWeight: 700, marginBottom: '0.25rem' }}>
                {selectedApp.scholarship?.title}
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Application Reference ID: {selectedApp.id}
              </p>
              <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span>Status: {getStatusBadge(selectedApp.status)}</span>
                <span>CGPA: <strong>{selectedApp.cgpa}</strong></span>
                <span>Annual Income: <strong>₹{selectedApp.annualIncome.toLocaleString()}</strong></span>
              </div>
            </div>

            {/* AI verification tags */}
            {selectedApp.agentResults && selectedApp.agentResults.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h5 style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                  AI Orchestrator Checks
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {selectedApp.agentResults.map(res => (
                    <div key={res.id} style={{ padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-card)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{res.agentType} Agent Audit</span>
                        <span style={{
                          fontSize: '0.75rem', fontWeight: 600,
                          color: res.status === 'SUCCESS' ? 'var(--accent-emerald)' : res.status === 'WARNING' ? 'var(--accent-saffron)' : 'var(--accent-rose)'
                        }}>
                          {res.status} ({Math.round(res.confidence * 100)}% Confidence)
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                        {res.agentType === 'COPILOT' ? res.resultData.summary : res.agentType === 'FRAUD' ? res.resultData.summary : 'Preliminary verification checks completed.'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Journey Timeline */}
            <div>
              <h5 style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
                Application Audit Trail
              </h5>
              <div className="timeline-vertical">
                {selectedApp.auditLogs?.map((log) => (
                  <div key={log.id} className="timeline-node completed">
                    <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600 }}>{log.action.replace(/_/g, ' ')}</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p style={{ fontSize: '0.875rem' }}>{log.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
