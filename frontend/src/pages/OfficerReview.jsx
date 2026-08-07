import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowLeft, FileText } from 'lucide-react';

const OfficerReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDocTab, setActiveDocTab] = useState('AADHAAR');
  const [comments, setComments] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      const data = await api.getApplication(id);
      setApplication(data);
    } catch (err) {
      alert('Failed to load application details: ' + err.message);
      navigate('/reviewer');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (actionType) => {
    if (!comments.trim()) {
      alert('Please enter review comments or justification details before submitting your decision.');
      return;
    }

    setActionLoading(true);
    try {
      await api.takeOfficerAction(id, actionType, comments);
      alert(`Application successfully ${actionType === 'APPROVE' ? 'Approved' : actionType === 'REJECT' ? 'Rejected' : 'Returned for revision'}`);
      navigate('/reviewer');
    } catch (err) {
      alert('Action failed: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', fontSize: '1.25rem' }}>Loading Application Details...</div>;
  }

  // BUG-005: Guard against null application (e.g., after a failed fetch that triggered navigate())
  if (!application) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', fontSize: '1.25rem' }}>Application not found.</div>;
  }

  const docResult = application.agentResults.find(r => r.agentType === 'DOCUMENT');
  const eligibilityResult = application.agentResults.find(r => r.agentType === 'ELIGIBILITY');
  const fraudResult = application.agentResults.find(r => r.agentType === 'FRAUD');
  const copilotResult = application.agentResults.find(r => r.agentType === 'COPILOT');

  const activeDoc = application.documents.find(d => d.documentType === activeDocTab);

  let trustScore = 90;
  if (docResult?.status === 'FAILED') trustScore -= 20;
  if (eligibilityResult?.status === 'FAILED') trustScore -= 30;
  if (fraudResult?.status === 'FAILED') trustScore -= 40;
  if (fraudResult?.status === 'WARNING') trustScore -= 15;
  trustScore = Math.max(trustScore, 10);

  return (
    <div className="container animate-slide-in" style={{ padding: '2rem 1.5rem' }}>
      {/* Top Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '1.25rem' }}>
        <button onClick={() => navigate('/reviewer')} className="btn btn-secondary flex-center">
          <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
          Back to Queue
        </button>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Status: <strong>{application.status}</strong></span>
        </div>
      </div>

      {/* Main Column Split */}
      <div className="split-layout">
        {/* Left Side */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Profile Card */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--accent-saffron)' }}>
              Applicant Credentials
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600 }}>Name</p>
                <p style={{ fontWeight: 700, marginBottom: '0.75rem' }}>{application.student?.name}</p>
                
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600 }}>Aadhaar Number</p>
                <p style={{ fontWeight: 700, marginBottom: '0.75rem' }}>{application.aadhaarNumber}</p>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600 }}>College</p>
                <p style={{ fontWeight: 700, marginBottom: '0.75rem' }}>{application.college}</p>
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600 }}>Caste / Category</p>
                <p style={{ fontWeight: 700, marginBottom: '0.75rem' }}>{application.category}</p>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600 }}>Academic CGPA</p>
                <p style={{ fontWeight: 700, marginBottom: '0.75rem' }}>{application.cgpa} CGPA</p>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600 }}>Family Annual Income</p>
                <p style={{ fontWeight: 700, marginBottom: '0.75rem' }}>₹{application.annualIncome.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Document Preview */}
          <div className="glass-panel" style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>
              Document Verification Vault
            </h3>

            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border-card)', marginBottom: '1.25rem' }}>
              {['MARKSHEET', 'AADHAAR', 'INCOME_CERTIFICATE'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  style={{
                    flex: 1, padding: '0.5rem', borderRadius: '6px', border: 'none', cursor: 'pointer',
                    fontWeight: 600, fontSize: '0.8125rem',
                    backgroundColor: activeDocTab === tab ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: activeDocTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                    transition: 'all 0.15s ease'
                  }}
                  onClick={() => setActiveDocTab(tab)}
                >
                  {tab.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            {activeDoc ? (
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-card)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={16} color="var(--accent-saffron)" />
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{activeDoc.fileUrl.split('/').pop()}</span>
                  </div>
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 700,
                    padding: '0.25rem 0.5rem', borderRadius: '4px',
                    backgroundColor: activeDoc.status === 'VERIFIED' ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
                    color: activeDoc.status === 'VERIFIED' ? 'var(--accent-emerald)' : 'var(--accent-rose)'
                  }}>
                    {activeDoc.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem', flex: 1 }}>
                  <div style={{ padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--border-card)', backgroundColor: 'rgba(0,0,0,0.2)', fontSize: '0.8125rem' }}>
                    <h5 style={{ fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Extracted Fields</h5>
                    {activeDoc.metadata ? (
                      Object.entries(JSON.parse(activeDoc.metadata)).map(([k, v]) => (
                        <div key={k} style={{ marginBottom: '0.375rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{k}: </span>
                          <strong style={{ color: 'var(--text-primary)' }}>{v}</strong>
                        </div>
                      ))
                    ) : (
                      <p style={{ color: 'var(--text-secondary)' }}>No fields extracted.</p>
                    )}
                  </div>

                  <div style={{ padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--border-card)', backgroundColor: 'rgba(0,0,0,0.2)', fontSize: '0.8125rem' }}>
                    <h5 style={{ fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>OCR Raw text</h5>
                    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: 'var(--text-secondary)', maxHeight: '180px', overflowY: 'auto' }}>
                      {activeDoc.extractedText || 'No text extracted.'}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>No document uploaded of this type.</p>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Trust Gauge */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              AI Decision Support Audit
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="gauge-container">
                <svg width="120" height="120" className="gauge-svg">
                  <defs>
                    <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--accent-blue)" />
                      <stop offset="100%" stopColor="var(--accent-saffron)" />
                    </linearGradient>
                  </defs>
                  <circle cx="60" cy="60" r="50" className="gauge-bg" />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    className="gauge-value"
                    style={{
                      strokeDasharray: 314,
                      strokeDashoffset: 314 - (314 * trustScore) / 100
                    }}
                  />
                </svg>
                <div className="gauge-text">{trustScore}%</div>
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>AI Trust Score Status</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  OCR document validations and cross-application duplicate scans match bounds with high confidence.
                </p>
              </div>
            </div>

            {copilotResult && (
              <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-card)', fontSize: '0.875rem' }}>
                <h5 style={{ fontWeight: 700, color: 'var(--accent-saffron)', marginBottom: '0.5rem' }}>Copilot Executive Summary:</h5>
                <p style={{ color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                  {copilotResult.resultData.summary}
                </p>
                <p style={{ color: 'var(--text-secondary)' }}>
                  <strong>Recommendation:</strong> <span style={{ color: copilotResult.resultData.recommendation === 'APPROVE' ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>{copilotResult.resultData.recommendation}</span>
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                  Reasoning: {copilotResult.resultData.reasoning}
                </p>
              </div>
            )}
          </div>

          {/* Eligibility check list */}
          {eligibilityResult && (
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                Scholarship Rules Eligibility Checklist
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>CGPA Requirement (Min: {eligibilityResult.resultData.cgpa?.required})</span>
                  <span style={{
                    fontWeight: 700,
                    color: eligibilityResult.resultData.cgpa?.status === 'PASS' ? 'var(--accent-emerald)' : 'var(--accent-rose)'
                  }}>
                    {eligibilityResult.resultData.cgpa?.status} ({eligibilityResult.resultData.cgpa?.extracted})
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Income Limit (Max: ₹{eligibilityResult.resultData.income?.limit?.toLocaleString()})</span>
                  <span style={{
                    fontWeight: 700,
                    color: eligibilityResult.resultData.income?.status === 'PASS' ? 'var(--accent-emerald)' : 'var(--accent-rose)'
                  }}>
                    {eligibilityResult.resultData.income?.status} (₹{eligibilityResult.resultData.income?.extracted?.toLocaleString()})
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Caste Category Eligibility</span>
                  <span style={{
                    fontWeight: 700,
                    color: eligibilityResult.resultData.category?.status === 'PASS' ? 'var(--accent-emerald)' : 'var(--accent-rose)'
                  }}>
                    {eligibilityResult.resultData.category?.status} ({eligibilityResult.resultData.category?.extracted})
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Fraud detection */}
          {fraudResult && (
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                Identity Theft & Fraud Risk Scan
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span>Cross-Application Duplicate UID/Aadhaar</span>
                <span style={{
                  fontWeight: 700,
                  color: fraudResult.resultData.duplicateAadhaar ? 'var(--accent-rose)' : 'var(--accent-emerald)'
                }}>
                  {fraudResult.resultData.duplicateAadhaar ? 'DUPLICATE FLAG' : 'Passed'}
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                Summary: {fraudResult.resultData.summary}
              </p>
            </div>
          )}

          {/* Action Comments */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem' }}>
              Review Decision & Comments
            </h4>

            {/* BUG-016: Only show action controls when the application is still awaiting review */}
            {application?.status === 'OFFICER_REVIEW' ? (
              <>
                <div className="form-group">
                  <textarea
                    className="form-input"
                    style={{ minHeight: '80px', resize: 'vertical' }}
                    placeholder="Provide comments, audit details, or revision request justifications..."
                    value={comments}
                    onChange={e => setComments(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleAction('REQUEST_REVISION')}
                    className="btn btn-secondary flex-center"
                    style={{ fontSize: '0.75rem' }}
                    disabled={actionLoading}
                  >
                    Request Info
                  </button>
                  <button
                    onClick={() => handleAction('REJECT')}
                    className="btn btn-primary flex-center"
                    style={{ backgroundColor: 'var(--accent-rose)', fontSize: '0.75rem' }}
                    disabled={actionLoading}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleAction('APPROVE')}
                    className="btn btn-primary flex-center"
                    style={{ backgroundColor: 'var(--accent-emerald)', fontSize: '0.75rem' }}
                    disabled={actionLoading}
                  >
                    Approve
                  </button>
                </div>
              </>
            ) : (
              <div style={{
                padding: '1rem', borderRadius: '8px', textAlign: 'center',
                backgroundColor: application?.status === 'APPROVED' ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)',
                border: `1px solid ${application?.status === 'APPROVED' ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}`
              }}>
                <p style={{
                  fontWeight: 700,
                  color: application?.status === 'APPROVED' ? 'var(--accent-emerald)' : 'var(--accent-rose)'
                }}>
                  Application already {application?.status === 'APPROVED' ? 'Approved ✓' : application?.status === 'REJECTED' ? 'Rejected ✗' : `in ${application?.status} status`}
                </p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.375rem' }}>
                  No further actions are available for this application.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerReview;
