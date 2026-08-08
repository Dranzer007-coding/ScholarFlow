import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowLeft, FileText, Bot, Send, X, Sparkles } from 'lucide-react';


const OfficerReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDocTab, setActiveDocTab] = useState('AADHAAR');
  const [comments, setComments] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Copilot Q&A Floating Drawer State
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotMessages, setCopilotMessages] = useState([]);
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotLoading, setCopilotLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  useEffect(() => {
    if (application && copilotMessages.length === 0) {
      setCopilotMessages([
        {
          sender: 'copilot',
          text: `Hello Officer! I am your evidence-based AI Copilot Assistant for Application #${id.substring(0, 8)}. Ask me any question about income criteria, academic scores, fraud flags, or scheme rules.`,
          facts: [`Student: ${application.student?.name}`, `Scheme: ${application.scholarship?.title}`],
          evidence: [`Application #${id.substring(0, 8)}`],
          recommendation: 'Recommended: Evidence Assistant Active',
          availableActions: [
            { label: "Why is applicant eligible?", question: "Why is this applicant eligible?" },
            { label: "Are documents valid?", question: "Are all uploaded documents valid and verified?" },
            { label: "Check Fraud & Aadhaar", question: "Are there any fraud flags or Aadhaar verification issues?" }
          ]
        }
      ]);
    }
  }, [application]);

  useEffect(() => {
    if (isCopilotOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [copilotMessages, isCopilotOpen]);

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

  const handleSendCopilotQuery = async (queryText) => {
    const q = queryText || copilotInput;
    if (!q.trim() || copilotLoading) return;

    const userMsg = { sender: 'user', text: q };
    setCopilotMessages(prev => [...prev, userMsg]);
    if (!queryText) setCopilotInput('');
    setCopilotLoading(true);

    try {
      const resData = await api.askOfficerCopilot(id, q);
      const botMsg = {
        sender: 'copilot',
        text: resData.answer,
        facts: resData.facts || [],
        evidence: resData.evidence || [],
        rule: resData.rule || null,
        assessment: resData.assessment || '',
        recommendation: resData.recommendation || '',
        availableActions: resData.availableActions || []
      };
      setCopilotMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setCopilotMessages(prev => [...prev, {
        sender: 'copilot',
        text: 'I cannot determine this from the available records: ' + err.message,
        recommendation: 'Error'
      }]);
    } finally {
      setCopilotLoading(false);
    }
  };

  const handleCopilotActionClick = (actionObj) => {
    if (actionObj.question) {
      handleSendCopilotQuery(actionObj.question);
      return;
    }
    if (actionObj.action) {
      setComments(`Copilot Evidence Recommendation (${actionObj.action}): Verified against scheme rules.`);
      const decisionSection = document.getElementById('review-decision-section');
      if (decisionSection) {
        decisionSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', fontSize: '1.25rem' }}>Loading Application Details...</div>;
  }

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
    <div className="container animate-slide-in" style={{ padding: '2rem 1.5rem', position: 'relative' }}>
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

          {/* Action Comments Section */}
          <div className="glass-panel" id="review-decision-section" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem' }}>
              Review Decision & Comments
            </h4>

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

      {/* ========================================================================= */}
      {/* FLOATING OFFICER AI COPILOT BUTTON & FLOATING Q&A PANEL (BOTTOM RIGHT)     */}
      {/* ========================================================================= */}

      {/* Floating Q&A Drawer Panel */}
      {isCopilotOpen && (
        <div style={{
          position: 'fixed',
          bottom: '88px',
          right: '24px',
          width: '420px',
          height: '560px',
          maxWidth: 'calc(100vw - 32px)',
          maxHeight: 'calc(100vh - 120px)',
          backgroundColor: '#0c1017',
          border: '1px solid rgba(255, 153, 51, 0.4)',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(255, 153, 51, 0.15)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {/* Panel Header */}
          <div style={{
            padding: '1rem 1.25rem',
            background: 'linear-gradient(135deg, rgba(255,153,51,0.12), rgba(24,28,40,0.8))',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--accent-saffron), #e67e22)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
              }}>
                <Bot size={18} />
              </div>
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)', margin: 0 }}>
                  Officer AI Copilot Q&A
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--accent-saffron)', margin: 0, fontWeight: 600 }}>
                  App #{id.substring(0, 8)} • Evidence Assistant
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCopilotOpen(false)}
              style={{
                background: 'none', border: 'none', color: 'var(--text-secondary)',
                cursor: 'pointer', padding: '0.25rem', borderRadius: '4px'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div style={{
            padding: '0.625rem 1rem',
            backgroundColor: 'rgba(255,255,255,0.02)',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}>
            <button
              type="button"
              onClick={() => handleSendCopilotQuery('Why is this applicant eligible?')}
              style={{
                fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: '12px',
                border: '1px solid rgba(255,153,51,0.3)', backgroundColor: 'rgba(255,153,51,0.08)',
                color: 'var(--accent-saffron)', cursor: 'pointer', fontWeight: 600
              }}
            >
              ⚡ Why eligible?
            </button>
            <button
              type="button"
              onClick={() => handleSendCopilotQuery('Are there any fraud or duplicate flags?')}
              style={{
                fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.04)',
                color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 500
              }}
            >
              🔍 Any Fraud Flags?
            </button>
            <button
              type="button"
              onClick={() => handleSendCopilotQuery('Show masked Aadhaar & Bank Details')}
              style={{
                fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.04)',
                color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 500
              }}
            >
              🔒 Masked Credentials
            </button>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            padding: '1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            fontSize: '0.84375rem'
          }}>
            {copilotMessages.map((msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '90%',
                  backgroundColor: msg.sender === 'user' ? 'rgba(255, 153, 51, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: msg.sender === 'user' ? '1px solid rgba(255, 153, 51, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  padding: '0.875rem 1rem',
                  color: 'var(--text-primary)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
              >
                {msg.sender === 'copilot' && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-saffron)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Sparkles size={13} /> Officer Evidence Assistant
                    </span>
                    {msg.recommendation && (
                      <span style={{
                        fontSize: '0.6875rem', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '4px',
                        backgroundColor: msg.recommendation.includes('APPROVE') ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)',
                        color: msg.recommendation.includes('APPROVE') ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                        border: `1px solid ${msg.recommendation.includes('APPROVE') ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}`
                      }}>
                        {msg.recommendation}
                      </span>
                    )}
                  </div>
                )}

                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.45', marginBottom: msg.facts?.length > 0 ? '0.625rem' : '0' }}>
                  {msg.text}
                </div>

                {/* Evidence & Action Buttons */}
                {msg.availableActions && msg.availableActions.length > 0 && (
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.625rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                    {msg.availableActions.map((act, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleCopilotActionClick(act)}
                        style={{
                          fontSize: '0.75rem', fontWeight: 600, padding: '0.3rem 0.6rem', borderRadius: '6px',
                          border: '1px solid rgba(255, 153, 51, 0.4)', backgroundColor: 'rgba(255, 153, 51, 0.1)',
                          color: 'var(--accent-saffron)', cursor: 'pointer', transition: 'all 0.15s ease'
                        }}
                      >
                        ⚡ {act.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {copilotLoading && (
              <div style={{
                alignSelf: 'flex-start',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px 14px 14px 2px',
                padding: '0.75rem 1rem',
                color: 'var(--text-secondary)',
                fontSize: '0.8125rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}>
                <Sparkles className="animate-spin" size={14} color="var(--accent-saffron)" />
                Analyzing evidence records & scheme rules...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendCopilotQuery(); }}
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              gap: '0.5rem'
            }}
          >
            <input
              type="text"
              className="form-input"
              style={{ flex: 1, padding: '0.5rem 0.875rem', fontSize: '0.8125rem', borderRadius: '8px' }}
              placeholder="Ask Copilot about evidence, rules, or flags..."
              value={copilotInput}
              onChange={(e) => setCopilotInput(e.target.value)}
              disabled={copilotLoading}
            />
            <button
              type="submit"
              className="btn btn-primary flex-center"
              style={{ padding: '0.5rem 0.875rem', borderRadius: '8px' }}
              disabled={copilotLoading || !copilotInput.trim()}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Trigger Button (Bottom Right Corner) */}
      <button
        type="button"
        onClick={() => setIsCopilotOpen(!isCopilotOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          height: '48px',
          padding: '0 1.25rem',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, var(--accent-saffron), #e67e22)',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 8px 24px rgba(255, 153, 51, 0.4), 0 0 12px rgba(255, 153, 51, 0.3)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          fontWeight: 700,
          fontSize: '0.875rem',
          zIndex: 1000,
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <Bot size={20} />
        <span>⚡ AI Copilot Q&A</span>
        {isCopilotOpen ? (
          <X size={16} style={{ marginLeft: '0.25rem' }} />
        ) : (
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2ecc71',
            boxShadow: '0 0 8px #2ecc71'
          }} />
        )}
      </button>
    </div>
  );
};

export default OfficerReview;
