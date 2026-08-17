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
  Send,
  Users,
  Code2
} from 'lucide-react';


const Home = () => {
  const navigate = useNavigate();
  const [activePersona, setActivePersona] = useState('students');

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

          {/* <button
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
          </button> */}
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

          {/* {activePersona === 'institutions' && (
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
          )} */}
        </div>
      </section>

      {/* MEET THE TEAM & ABOUT US SECTION */}
      <section id="team" style={{
        maxWidth: '1200px',
        margin: '5rem auto 3rem',
        padding: '0 1.5rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            background: 'rgba(249, 115, 22, 0.12)',
            border: '1px solid rgba(249, 115, 22, 0.3)',
            marginBottom: '0.75rem'
          }}>
            <Users size={16} color="var(--accent-saffron)" />
            <span style={{ color: 'var(--accent-saffron)', fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              MEET THE BUILDERS
            </span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, marginTop: '0.25rem' }}>
            The Team Behind ScholarFlow AI
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0.75rem auto 0', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Architecting next-generation autonomous AI multi-agent pipelines for transparent, fraud-free, and rapid scholarship governance.
          </p>
        </div>

        {/* 4 Circular Photo Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {[
            {
              name: 'ANUBRATA DAS',
              role: 'Lead Developer & AI Architect',
              specialization: 'Designing the system architecture and building the backend, AI-agent workflow, integrations, and deployment infrastructure',
              gradient: 'linear-gradient(135deg, #f97316, #e11d48)',
              avatarBg: '#2a1710',
              initials: 'AD',
              image: '/team/anubrata.jpg',
              github: 'https://github.com/Dranzer007-coding',
              linkedin: 'https://www.linkedin.com/in/anubrata-das-953173372/'
            },
            {
              name: 'SIBUN KUMAR SAHU',
              role: 'Frontend Engineer & UI/UX Designer',
              specialization: 'Bringing the product to life through React, intuitive interfaces, dashboards, and a smooth user experience.',
              gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              avatarBg: '#101a2e',
              initials: 'SKS',
              image: '/team/sibun.jpg',
              github: 'https://github.com/25155332-sibun',
              linkedin: 'https://www.linkedin.com/in/sibun-kumar-sahu-0b2729375/'
            },
            {
              name: 'SOUMYADIP DEY',
              role: 'Product & QA Engineer',
              specialization: 'Turning requirements into clear workflows, documentation, test scenarios, and a polished product experience.',
              gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
              avatarBg: '#0e261f',
              initials: 'SD',
              image: '/team/soumyadip.jpg',
              github: 'https://github.com/25155336-Soumyadip',
              linkedin: 'https://www.linkedin.com/in/soumyadip-dey-005822368/'
            },
            {
              name: 'ANUBHAB ROY',
              role: 'Data & Integration Support',
              specialization: 'Ensuring reliable data flow through database validation, API testing, integration checks, and live-demo support.',
              gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              avatarBg: '#291d0c',
              initials: 'AR',
              image: '/team/anubhab.jpg',
              github: 'https://github.com/anubhabroy01',
              linkedin: 'https://www.linkedin.com/in/anubhab-roy-2a9364383/'
            }
          ].map((member, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: '2.25rem 1.5rem',
                borderRadius: '24px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'linear-gradient(145deg, rgba(13, 19, 33, 0.9), rgba(18, 26, 45, 0.8))',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.4)';
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(249, 115, 22, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
              }}
            >
              {/* Circular Avatar Frame */}
              <div style={{
                position: 'relative',
                width: '120px',
                height: '120px',
                margin: '0 auto 1.5rem',
                borderRadius: '50%',
                padding: '4px',
                background: member.gradient,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: member.avatarBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: '#fff',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.05em',
                  border: '2px solid rgba(13, 19, 33, 0.9)',
                  overflow: 'hidden'
                }}>
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '50%'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    member.initials
                  )}
                </div>
              </div>

              {/* Name & Role */}
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.35rem',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '0.35rem'
              }}>
                {member.name}
              </h3>

              <div style={{
                display: 'inline-block',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: 'var(--accent-saffron)',
                letterSpacing: '0.04em',
                marginBottom: '0.85rem',
                textTransform: 'uppercase'
              }}>
                {member.role}
              </div>

              <p style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
                margin: '0 0 1.25rem',
                minHeight: '2.6em'
              }}>
                {member.specialization}
              </p>

              {/* Social Links */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} GitHub`}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    transition: 'all 0.2s ease',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.background = 'rgba(249, 115, 22, 0.2)';
                    e.currentTarget.style.borderColor = 'var(--accent-saffron)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                </a>

                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} LinkedIn`}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    transition: 'all 0.2s ease',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                    e.currentTarget.style.borderColor = '#3b82f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Hackathon Highlights & Core Architecture Banner */}
        <div className="glass-panel" style={{
          padding: '1.75rem 2.25rem',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.08), rgba(16, 185, 129, 0.06))',
          border: '1px solid rgba(249, 115, 22, 0.2)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'rgba(249, 115, 22, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-saffron)',
              flexShrink: 0
            }}>
              <Code2 size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#fff' }}>
                Built for Next-Gen Scholarship Governance
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>
                Powered by 5 Autonomous AI Agents, Prisma ORM Audit Trails, and Deterministic Fallbacks.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.06)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--accent-emerald)',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              ✓ 5 Multi-Agent Roles
            </span>
            <span style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.06)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--accent-saffron)',
              border: '1px solid rgba(249, 115, 22, 0.3)'
            }}>
              ✓ Zero Hallucination Policy
            </span>
          </div>
        </div>
      </section>

      {/* CONTACT & FEEDBACK SECTION */}
      <section id="contact" style={{
        maxWidth: '1200px',
        margin: '5rem auto',
        padding: '0 1.5rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ color: 'var(--accent-saffron)', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            FEEDBACK & RATINGS
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, marginTop: '0.5rem' }}>
            Shape the Future of ScholarFlow AI
          </h2>
        </div>

        <div className="glass-panel" style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '0',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(249, 115, 22, 0.25)',
          background: 'linear-gradient(135deg, rgba(13, 19, 33, 0.95), rgba(10, 14, 26, 0.98))'
        }}>
          {/* Banner Graphic Header */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '220px',
            overflow: 'hidden',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <img
              src="/feedback_banner.png"
              alt="ScholarFlow AI Feedback Survey Header"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.9) contrast(1.1)'
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(10, 14, 26, 0.95) 0%, rgba(10, 14, 26, 0.3) 60%, transparent 100%)',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '1.75rem 2.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img
                  src="/logo.jpg"
                  alt="ScholarFlow AI Logo"
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(249, 115, 22, 0.4)',
                    border: '2px solid var(--accent-saffron)'
                  }}
                />
                <div>
                  <span style={{ color: 'var(--accent-saffron)', fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    OFFICIAL USER REVIEW SURVEY
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                    ScholarFlow AI Feedback Form
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Section Body */}
          <div style={{ padding: '2.5rem', textAlign: 'center' }}>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '1.05rem',
              lineHeight: 1.6,
              maxWidth: '720px',
              margin: '0 auto 2rem'
            }}>
              Help us shape the future of AI-powered scholarship governance in India. Share your experience, rate our agent accuracy, and suggest improvements directly on our official survey form.
            </p>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1.25rem',
              flexWrap: 'wrap'
            }}>
              <a
                href="https://forms.gle/mriLSbNwvh2poofs7"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{
                  padding: '0.95rem 2.25rem',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  boxShadow: '0 8px 30px rgba(249, 115, 22, 0.4)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  textDecoration: 'none'
                }}
              >
                <Sparkles size={20} />
                Open Official Feedback Form
                <ArrowRight size={18} />
              </a>
            </div>

            <div style={{
              marginTop: '2.25rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '2rem',
              flexWrap: 'wrap',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)'
            }}>
              <div>
                📧 Support Email: <a href="mailto:scholarflow.ai269@gmail.com" style={{ color: 'var(--accent-saffron)', textDecoration: 'none', fontWeight: 600 }}>scholarflow.ai269@gmail.com</a>
              </div>
              <div>
                🔒 100% Confidential & Secure Feedback
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
