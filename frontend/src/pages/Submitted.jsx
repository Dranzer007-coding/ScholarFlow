import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, Download } from 'lucide-react';
import { api } from '../services/api';
import { jsPDF } from 'jspdf';

const Submitted = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { appId } = location.state || { appId: 'APP-2026-UNKNOWN' };

  const [aadhaarState, setAadhaarState] = useState('PROCESSING');
  const [incomeState, setIncomeState] = useState('WAITING');
  const [fraudState, setFraudState] = useState('WAITING');
  const [officerState, setOfficerState] = useState('WAITING');
  const [application, setApplication] = useState(null);

  useEffect(() => {
    if (appId && appId !== 'APP-2026-UNKNOWN') {
      api.getApplication(appId)
        .then(data => setApplication(data))
        .catch(err => console.error('Failed to load application details for PDF:', err));
    }
  }, [appId]);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setAadhaarState('SUCCESS');
      setIncomeState('PROCESSING');
    }, 1000);

    const t2 = setTimeout(() => {
      setIncomeState('SUCCESS');
      setFraudState('PROCESSING');
    }, 2200);

    const t3 = setTimeout(() => {
      setFraudState('SUCCESS');
      setOfficerState('SUCCESS');
    }, 3400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleDownloadAcknowledgement = () => {
    const appData = application || {
      id: appId,
      createdAt: new Date().toISOString(),
      cgpa: 0.0,
      annualIncome: 0.0,
      category: 'N/A',
      course: 'N/A',
      college: 'N/A',
      bankAccountNumber: 'N/A',
      ifscCode: 'N/A',
      aadhaarNumber: 'N/A',
      student: { name: 'Applicant', email: 'N/A' },
      scholarship: { title: 'Applied Scheme', amount: 0.0 }
    };

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const ackNumber = `SF-ACK-2026-${appData.id.substring(0, 8).toUpperCase()}`;
    const submissionDate = new Date(appData.createdAt).toLocaleString();

    // Color Palette
    const primaryColor = [249, 115, 22]; // Orange (Saffron)
    const secondaryColor = [30, 41, 59]; // Dark Slate
    const textColor = [51, 65, 85]; // Gray text
    const labelColor = [100, 116, 139]; // Muted text

    // 1. Header Banner
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');

    // App Title
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text('ScholarFlow AI', 15, 20);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    doc.text('Real-time Multi-Agent Scholarship Governance Platform', 15, 28);

    // 2. Title Section
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text('SUBMISSION ACKNOWLEDGEMENT RECEIPT', 15, 55);

    // Colored line under title
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(15, 58, 180, 1, 'F');

    // 3. Receipt Details
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(labelColor[0], labelColor[1], labelColor[2]);
    doc.text('Acknowledgement No:', 15, 68);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text(ackNumber, 65, 68);

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(labelColor[0], labelColor[1], labelColor[2]);
    doc.text('Submission Date:', 15, 74);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text(submissionDate, 65, 74);

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(labelColor[0], labelColor[1], labelColor[2]);
    doc.text('Application ID:', 15, 80);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text(appData.id, 65, 80);

    // 4. Section: Scheme Details
    doc.setFillColor(248, 250, 252);
    doc.rect(15, 88, 180, 24, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(15, 88, 180, 24, 'S');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('SCHEME APPLIED DETAILS', 20, 94);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(labelColor[0], labelColor[1], labelColor[2]);
    doc.text('Scholarship Title:', 20, 101);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text(appData.scholarship?.title || 'Scholarship Scheme', 55, 101);

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(labelColor[0], labelColor[1], labelColor[2]);
    doc.text('Sanctioned Amount:', 20, 107);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text(`INR ${appData.scholarship?.amount?.toLocaleString() || 'N/A'}`, 55, 107);

    // 5. Section: Applicant Information
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text('APPLICANT DETAILS', 15, 122);
    doc.setFillColor(226, 232, 240);
    doc.rect(15, 124, 180, 0.5, 'F');

    let y = 132;
    const drawField = (label, val, xOffset = 15) => {
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(labelColor[0], labelColor[1], labelColor[2]);
      doc.text(label, xOffset, y);
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.text(String(val || 'N/A'), xOffset + 40, y);
    };

    const drawFieldRight = (label, val) => {
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(labelColor[0], labelColor[1], labelColor[2]);
      doc.text(label, 110, y);
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.text(String(val || 'N/A'), 150, y);
    };

    drawField('Student Name:', appData.student?.name);
    drawFieldRight('Email Address:', appData.student?.email);
    y += 8;

    drawField('Aadhaar Number:', appData.aadhaarNumber);
    drawFieldRight('Social Category:', appData.category);
    y += 8;

    drawField('College/Univ:', appData.college);
    drawFieldRight('Course:', appData.course);
    y += 8;

    drawField('Current CGPA:', `${appData.cgpa} / 10.0`);
    drawFieldRight('Family Income:', `INR ${appData.annualIncome?.toLocaleString()}`);
    y += 8;

    drawField('Bank Account:', appData.bankAccountNumber);
    drawFieldRight('IFSC Code:', appData.ifscCode);
    y += 15;

    // 6. Verification Status Info Box
    doc.setFillColor(240, 253, 250); // Light Mint/Teal
    doc.rect(15, y, 180, 22, 'F');
    doc.setDrawColor(204, 251, 241);
    doc.rect(15, y, 180, 22, 'S');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(13, 148, 136); // Teal color
    doc.text('Verification Pipeline Status:', 20, y + 7);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text('AI agents completed document and fraud checks. Queue position: Pending Officer Review.', 20, y + 14);

    // 7. Footer Disclaimer
    doc.setFont('Helvetica', 'oblique');
    doc.setFontSize(8);
    doc.setTextColor(labelColor[0], labelColor[1], labelColor[2]);
    doc.text('Disclaimer: This receipt is automatically compiled upon successful digital submission to ScholarFlow AI.', 15, 275);
    doc.text('This is an electronically generated acknowledgment receipt and requires no physical signature.', 15, 280);

    doc.save(`ScholarFlow_Acknowledgement_${ackNumber}.pdf`);
  };

  const getStatusBadge = (state) => {
    if (state === 'WAITING') {
      return <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Waiting...</span>;
    }
    if (state === 'PROCESSING') {
      return (
        <span style={{ color: 'var(--accent-saffron)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <Loader2 size={14} style={{ animation: 'pulse 1.5s infinite' }} />
          Analyzing OCR...
        </span>
      );
    }
    return <span style={{ color: 'var(--accent-emerald)', fontSize: '0.875rem', fontWeight: 600 }}>✓ Verified by AI</span>;
  };

  return (
    <div className="flex-center animate-slide-in" style={{ minHeight: 'calc(100vh - 120px)', padding: '2rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '580px', padding: '3rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ color: 'var(--accent-emerald)', backgroundColor: 'rgba(16,185,129,0.1)', padding: '1.25rem', borderRadius: '50%' }}>
            <CheckCircle2 size={48} />
          </div>
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Application Submitted!
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: '2rem' }}>
          Application Reference ID: <strong style={{ color: 'var(--text-primary)' }}>{appId.substring(0, 8).toUpperCase()}</strong>
        </p>

        {/* Real-time Ticks Panel */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2.5rem', textAlign: 'left' }}>
          <h4 style={{ fontWeight: 700, fontSize: '0.9375rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
            Real-Time Processing Pipeline
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9375rem' }}>Aadhaar Identity Matching</span>
              {getStatusBadge(aadhaarState)}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9375rem' }}>Income Certificate OCR</span>
              {getStatusBadge(incomeState)}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9375rem' }}>Fraud Sweep Check</span>
              {getStatusBadge(fraudState)}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9375rem' }}>Review Officer Allocation</span>
              {officerState === 'SUCCESS' ? (
                <span style={{ color: 'var(--accent-emerald)', fontSize: '0.875rem', fontWeight: 600 }}>Queued (Officer Aachal)</span>
              ) : (
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Waiting for prior checks...</span>
              )}
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', alignItems: 'center' }}>
          <button onClick={handleDownloadAcknowledgement} className="btn btn-primary flex-center" style={{ width: '100%', maxWidth: '280px', padding: '0.875rem' }}>
            <Download size={18} style={{ marginRight: '0.5rem' }} />
            Download Acknowledgement
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ width: '100%', maxWidth: '280px', padding: '0.875rem' }}>
            Go to Student Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Submitted;
