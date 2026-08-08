import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Cpu,
  ArrowRight,
  FileCheck,
  Scale,
  Search,
  UserCheck,
  Bell,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Building2,
  GraduationCap,
  Award,
  Send
} from 'lucide-react';


const Home = () => {
  const navigate = useNavigate();
  const [activePersona, setActivePersona] = useState('students');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    role: 'Student',
    subject: 'Feedback',
    message: ''
  });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setContactForm({ name: '', email: '', role: 'Student', subject: 'Feedback', message: '' });
    }, 4000);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-container" style={{ width: '100%', overflowX: 'hidden' }}>

      {/* HERO SECTION */}
      <section className="hero-section" style={{
        position: 'relative',
        padding: '3rem 1.5rem 4rem',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        {/* Glow backdrop decorative light */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div style={{ position: 'relative', zIndex: 1 }} className="animate-slide-in">
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            background: 'rgba(249, 115, 22, 0.1)',
            border: '1px solid rgba(249, 115, 22, 0.3)',
            color: 'var(--accent-saffron)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            marginBottom: '1.75rem',
            textTransform: 'uppercase'
          }}>
            <Sparkles size={14} /> AI-Powered Scholarship Governance Infrastructure
          </div>

          {/* Main Title */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem'
          }}>
            SCHOLARFLOW <span className="text-gradient">AI</span>
          </h1>

          {/* Slogan */}
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.25rem, 3vw, 2.25rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.3,
            marginBottom: '1rem'
          }}>
            Fair Access. Verified Decisions. <span style={{ color: 'var(--accent-saffron)' }}>A Stronger Bharat.</span>
          </h2>

          {/* Description */}
          <p style={{
            maxWidth: '680px',
            margin: '0 auto 2.5rem',
            fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.6
          }}>
            Agent-driven scholarship verification and approval infrastructure for India.
          </p>

          {/* Hero Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '3.5rem'
          }}>
            <button
              onClick={() => navigate('/login')}
              className="btn btn-primary"
              style={{
                padding: '0.875rem 2rem',
                fontSize: '1rem',
                borderRadius: '10px',
                boxShadow: '0 8px 25px rgba(249, 115, 22, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              Try ScholarFlow <ArrowRight size={18} />
            </button>

            <button
              onClick={() => scrollToSection('how-it-works')}
              className="btn btn-secondary"
              style={{
                padding: '0.875rem 1.75rem',
                fontSize: '1rem',
                borderRadius: '10px'
              }}
            >
              Explore AI Agents
            </button>
          </div>

          {/* Official Logo Banner */}
          <div className="glass-panel glass-card-hover" style={{
            maxWidth: '480px',
            margin: '0 auto',
            padding: '2rem',
            borderRadius: '20px',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(249, 115, 22, 0.15)',
            border: '1px solid rgba(249, 115, 22, 0.3)',
            background: 'linear-gradient(180deg, rgba(13, 19, 33, 0.95) 0%, rgba(7, 11, 19, 0.9) 100%)'
          }}>
            <img
              src="/logo.jpg"
              alt="ScholarFlow AI Logo"
              style={{
                width: '100%',
                maxHeight: '260px',
                objectFit: 'contain',
                borderRadius: '12px',
                display: 'block',
                margin: '0 auto'
              }}
            />
          </div>
        </div>
      </section>

      {/* 3-STEP PIPELINE BANNER (01 VERIFY | 02 ASSESS | 03 DECIDE) */}
      <section id="product" style={{
        maxWidth: '1200px',
        margin: '2rem auto 4rem',
        padding: '0 1.5rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Step 01 */}
          <div className="glass-panel glass-card-hover" style={{ padding: '2rem', borderRadius: '16px', position: 'relative' }}>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              fontFamily: 'var(--font-display)',
              color: 'var(--accent-saffron)',
              marginBottom: '0.75rem',
              opacity: 0.9
            }}>
              01
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Verify Documents
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
              Instant OCR extraction on Aadhaar, income certificates, & marksheets with strict 12-digit Aadhaar formatting & identity checks.
            </p>
          </div>

          {/* Step 02 */}
          <div className="glass-panel glass-card-hover" style={{ padding: '2rem', borderRadius: '16px', position: 'relative' }}>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              fontFamily: 'var(--font-display)',
              color: 'var(--accent-blue)',
              marginBottom: '0.75rem',
              opacity: 0.9
            }}>
              02
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Assess Eligibility
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
              Deterministic rule engine checks min CGPA, max family income limits, and socio-economic category with zero AI hallucination.
            </p>
          </div>

          {/* Step 03 */}
          <div className="glass-panel glass-card-hover" style={{ padding: '2rem', borderRadius: '16px', position: 'relative' }}>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              fontFamily: 'var(--font-display)',
              color: 'var(--accent-emerald)',
              marginBottom: '0.75rem',
              opacity: 0.9
            }}>
              03
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Decide & Sanction
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
              Fraud agent sweeps duplicate bank records & Aadhaar reuse, while Officer Copilot synthesizes 1-click approval summaries.
            </p>
          </div>
        </div>
      </section>

      {/* ABOUT SCHOLARFLOW (PROBLEM -> SOLUTION -> IMPACT) */}
      <section id="about" style={{
        maxWidth: '1200px',
        margin: '4rem auto',
        padding: '0 1.5rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ color: 'var(--accent-saffron)', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            ABOUT SCHOLARFLOW AI
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, marginTop: '0.5rem' }}>
            Transforming Indian Scholarship Governance
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0.5rem auto 0', fontSize: '1rem' }}>
            Bridging the gap between ambitious students and timely financial aid through transparent AI multi-agent verification.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {/* Problem */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px', borderTop: '4px solid var(--accent-rose)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent-rose)' }}>
                <AlertCircle size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>The Problem</h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.9375rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-rose)', fontWeight: 700 }}>•</span>
                Over ₹5,000+ Crore in Indian scholarships delayed due to manual paper verification backlogs.
              </li>
              <li style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-rose)', fontWeight: 700 }}>•</span>
                Double-dipping and certificate forgery drain public welfare funds away from needy students.
              </li>
              <li style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-rose)', fontWeight: 700 }}>•</span>
                Opaque rejection reasons leave students helpless without clear revision guidance.
              </li>
            </ul>
          </div>

          {/* Solution */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px', borderTop: '4px solid var(--accent-blue)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)' }}>
                <Cpu size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>The AI Solution</h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.9375rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>•</span>
                Autonomous 5-agent pipeline handling OCR, eligibility calculation, fraud check, and copilot summary.
              </li>
              <li style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>•</span>
                Strict zero-hallucination policy adhering to hard criteria stored in Prisma database.
              </li>
              <li style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>•</span>
                Complete audit log traceability for every AI confidence score and rule check.
              </li>
            </ul>
          </div>

          {/* Impact */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px', borderTop: '4px solid var(--accent-emerald)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)' }}>
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>The Impact</h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.9375rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>•</span>
                95% reduction in verification turnaround time (from months to minutes).
              </li>
              <li style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>•</span>
                Zero double-dipping fraud protecting public funds for genuine scholars.
              </li>
              <li style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>•</span>
                Empowering students across India with instant dashboard status updates.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (THE 5 AUTONOMOUS AI AGENTS) */}
      <section id="how-it-works" style={{
        maxWidth: '1200px',
        margin: '5rem auto',
        padding: '0 1.5rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ color: 'var(--accent-saffron)', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            SYSTEM ARCHITECTURE
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, marginTop: '0.5rem' }}>
            Powered by 5 Autonomous AI Agents
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0.5rem auto 0', fontSize: '1rem' }}>
            Built strictly adhering to the ScholarFlow AI Agent Constitution for speed, accuracy, and auditability.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Agent 1 */}
          <div className="glass-panel glass-card-hover" style={{ padding: '1.75rem', borderRadius: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(249,115,22,0.1)', color: 'var(--accent-saffron)' }} className="flex-center">
                <FileCheck size={22} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
                AGENT 01
              </span>
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Document OCR & Verification</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Extracts Aadhaar (12-digit format check), income certificate figures, and marksheet grades. Automatically flags name mismatches.
            </p>
          </div>

          {/* Agent 2 */}
          <div className="glass-panel glass-card-hover" style={{ padding: '1.75rem', borderRadius: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', color: 'var(--accent-blue)' }} className="flex-center">
                <Scale size={22} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
                AGENT 02
              </span>
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Eligibility Engine</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Compares CGPA against <code style={{ color: 'var(--accent-blue)' }}>criteriaMinCgpa</code> and family income against <code style={{ color: 'var(--accent-blue)' }}>criteriaMaxIncome</code> with zero hallucination.
            </p>
          </div>

          {/* Agent 3 */}
          <div className="glass-panel glass-card-hover" style={{ padding: '1.75rem', borderRadius: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(244,63,94,0.1)', color: 'var(--accent-rose)' }} className="flex-center">
                <Search size={22} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
                AGENT 03
              </span>
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Fraud Detection Sweep</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Searches historical application logs for duplicate Aadhaar numbers or cross-student bank account sharing (flags risk scores ≥ 0.6).
            </p>
          </div>

          {/* Agent 4 */}
          <div className="glass-panel glass-card-hover" style={{ padding: '1.75rem', borderRadius: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', color: 'var(--accent-emerald)' }} className="flex-center">
                <UserCheck size={22} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
                AGENT 04
              </span>
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Officer Copilot AI</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Synthesizes all audit details into a concise 2-sentence executive summary with recommended decisions (Approve / Reject / Revision).
            </p>
          </div>

          {/* Agent 5 */}
          <div className="glass-panel glass-card-hover" style={{ padding: '1.75rem', borderRadius: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(168,85,247,0.1)', color: '#a855f7' }} className="flex-center">
                <Bell size={22} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
                AGENT 05
              </span>
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Notification Dispatcher</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Dispatches instant dashboard notifications and clear SMS/email alerts to students, including officer remarks for document revisions.
            </p>
          </div>
        </div>
      </section>

      {/* BUILT FOR STUDENTS | OFFICERS | INSTITUTIONS */}
      <section style={{
        maxWidth: '1200px',
        margin: '5rem auto',
        padding: '0 1.5rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ color: 'var(--accent-saffron)', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            TAILORED WORKFLOWS
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, marginTop: '0.5rem' }}>
            Built for Every Stakeholder
          </h2>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.75rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActivePersona('students')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              border: activePersona === 'students' ? '1px solid var(--accent-saffron)' : '1px solid var(--border-card)',
              background: activePersona === 'students' ? 'rgba(249, 115, 22, 0.15)' : 'rgba(255,255,255,0.03)',
              color: activePersona === 'students' ? 'var(--accent-saffron)' : 'var(--text-secondary)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9375rem',
              transition: 'all 0.2s ease'
            }}
          >
            <GraduationCap size={18} /> For Students
          </button>

          <button
            onClick={() => setActivePersona('officers')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              border: activePersona === 'officers' ? '1px solid var(--accent-blue)' : '1px solid var(--border-card)',
              background: activePersona === 'officers' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.03)',
              color: activePersona === 'officers' ? 'var(--accent-blue)' : 'var(--text-secondary)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9375rem',
              transition: 'all 0.2s ease'
            }}
          >
            <ShieldCheck size={18} /> For Officers
          </button>

          <button
            onClick={() => setActivePersona('institutions')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              border: activePersona === 'institutions' ? '1px solid var(--accent-emerald)' : '1px solid var(--border-card)',
              background: activePersona === 'institutions' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)',
              color: activePersona === 'institutions' ? 'var(--accent-emerald)' : 'var(--text-secondary)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9375rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Building2 size={18} /> For Nodal Agencies
          </button>
        </div>

        {/* Tab Content Box */}
        <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '20px' }}>
          {activePersona === 'students' && (
            <div className="animate-slide-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-saffron)', marginBottom: '0.75rem' }}>
                  Seamless Student Portal
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Students submit applications in under 3 minutes with pre-validation document tools and real-time status tracking.
                </p>
                <button onClick={() => navigate('/login')} className="btn btn-primary">
                  Apply as Student <ArrowRight size={16} style={{ marginLeft: '0.4rem' }} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={20} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Instant Clarity Feedback:</strong> Immediate OCR feedback if Aadhaar or Income Certificate scans are unreadable.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={20} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Live Audit Timeline:</strong> Watch your application step through verification, fraud check, and sanction.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={20} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>One-Click Revision Resubmission:</strong> Fix requested documents without starting over.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePersona === 'officers' && (
            <div className="animate-slide-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-blue)', marginBottom: '0.75rem' }}>
                  Copilot Workstation for Officers
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Verification officers leverage AI Copilot split views to review 50+ applications per hour with 100% decision confidence.
                </p>
                <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ backgroundColor: 'var(--accent-blue)' }}>
                  Officer Sign In <ArrowRight size={16} style={{ marginLeft: '0.4rem' }} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={20} color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>2-Sentence Executive AI Summary:</strong> Copilot pre-digests document findings and eligibility checklists.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={20} color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Automated Fraud Indicators:</strong> High-risk score warnings (duplicate bank/Aadhaar) highlighted immediately.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={20} color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>1-Click Decision Authorization:</strong> Approve, Reject, or Request Revision with 1 tap.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePersona === 'institutions' && (
            <div className="animate-slide-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-emerald)', marginBottom: '0.75rem' }}>
                  Governance & Compliance for Agencies
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Nodal agencies, state departments, and universities get complete visibility over budget disbursement and audit logs.
                </p>
                <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ backgroundColor: 'var(--accent-emerald)' }}>
                  Access Enterprise Portal <ArrowRight size={16} style={{ marginLeft: '0.4rem' }} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={20} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Zero Double-Dipping Leakage:</strong> Protect state & central funds against multi-scheme double claims.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={20} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Prisma Audit Log Traceability:</strong> Immutable logs of every document scan, rule score, and officer action.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={20} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>100% Uptime & Graceful Rule Fallbacks:</strong> AI agent pipeline operates reliably even during peak volumes.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CONTACT & FEEDBACK SECTION */}
      <section id="contact" style={{
        maxWidth: '900px',
        margin: '5rem auto 4rem',
        padding: '0 1.5rem'
      }}>
        <div className="glass-panel" style={{
          padding: '3rem 2.5rem',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ color: 'var(--accent-saffron)', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              GET IN TOUCH & FEEDBACK
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginTop: '0.4rem' }}>
              Contact ScholarFlow AI Team
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.4rem' }}>
              Have questions, feedback, or need assistance? Send us a message and our team will respond shortly.
              Email: <a href="mailto:[anubratadas.kiit@gmail.com]">anubratadas.kiit@gmail.com</a>
            </p>
          </div>

          {feedbackSubmitted ? (
            <div className="animate-slide-in" style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid var(--accent-emerald)',
              padding: '2rem',
              borderRadius: '16px',
              textAlign: 'center'
            }}>
              <CheckCircle size={48} color="var(--accent-emerald)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Thank You for Your Feedback!
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                Your message has been received by the ScholarFlow AI team. We appreciate your contribution to building a stronger scholarship ecosystem.
              </p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your name"
                    value={contactForm.name}
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="name@domain.com"
                    value={contactForm.email}
                    onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">I Am A...</label>
                  <select
                    className="form-input"
                    value={contactForm.role}
                    onChange={e => setContactForm({ ...contactForm, role: e.target.value })}
                    style={{ background: 'rgba(13, 19, 33, 0.9)' }}
                  >
                    <option value="Student">Student</option>
                    <option value="Scholarship Officer">Scholarship Officer</option>
                    <option value="Educational Institution">Educational Institution</option>
                    <option value="Government Official">Government / Nodal Official</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <select
                    className="form-input"
                    value={contactForm.subject}
                    onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                    style={{ background: 'rgba(13, 19, 33, 0.9)' }}
                  >
                    <option value="Feedback">Product Feedback</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Support">Technical Support</option>
                    <option value="Partnership">Institutional Partnership</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Your Message / Feedback</label>
                <textarea
                  className="form-input"
                  rows={4}
                  placeholder="Share your thoughts, suggestions, or inquiry..."
                  value={contactForm.message}
                  onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary flex-center"
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  fontSize: '1rem',
                  borderRadius: '10px',
                  boxShadow: '0 4px 20px rgba(249, 115, 22, 0.3)'
                }}
              >
                <Send size={18} style={{ marginRight: '0.5rem' }} />
                Submit Message
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;
