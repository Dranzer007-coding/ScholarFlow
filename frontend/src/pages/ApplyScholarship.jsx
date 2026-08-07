import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { User, GraduationCap, DollarSign, Upload, ClipboardCheck, ArrowLeft, ArrowRight, Check } from 'lucide-react';

const ApplyScholarship = () => {
  const [step, setStep] = useState(1);
  const [scholarships, setScholarships] = useState([]);
  const [selectedScholarshipId, setSelectedScholarshipId] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [aadhaar, setAadhaar] = useState('');

  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('');
  const [cgpa, setCgpa] = useState('');

  const [income, setIncome] = useState('');
  const [occupation, setOccupation] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifsc, setIfsc] = useState('');

  // Documents state
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [incomeFile, setIncomeFile] = useState(null);
  const [marksheetFile, setMarksheetFile] = useState(null);

  const [aadhaarStatus, setAadhaarStatus] = useState('NOT_UPLOADED'); // NOT_UPLOADED, UPLOADING, SUCCESS, FAILED
  const [incomeStatus, setIncomeStatus] = useState('NOT_UPLOADED');
  const [marksheetStatus, setMarksheetStatus] = useState('NOT_UPLOADED');

  const [createdAppId, setCreatedAppId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const user = api.getCurrentUser();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    api.getScholarships().then(data => {
      setScholarships(data);
      if (data.length > 0) setSelectedScholarshipId(data[0].id);
    }).catch(err => {
      console.error(err);
    });

    setName(user.name);
  }, []);

  const handleNextStep = async () => {
    setError('');

    if (step === 1) {
      if (aadhaar.length !== 12 || !/^\d+$/.test(aadhaar)) {
        setError('Aadhaar must be a 12-digit numeric value');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (parseFloat(cgpa) < 0 || parseFloat(cgpa) > 10) {
        setError('CGPA must be between 0.0 and 10.0');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setLoading(true);
      try {
        const app = await api.createApplication({
          scholarshipId: selectedScholarshipId,
          cgpa: parseFloat(cgpa),
          annualIncome: parseFloat(income),
          category: category,
          course: course,
          college: college,
          bankAccountNumber: bankAccount,
          ifscCode: ifsc,
          aadhaarNumber: aadhaar
        });
        setCreatedAppId(app.id);
        setStep(4);
      } catch (err) {
        setError(err.message || 'Failed to create application draft');
      } finally {
        setLoading(false);
      }
    } else if (step === 4) {
      if (aadhaarStatus !== 'SUCCESS' || incomeStatus !== 'SUCCESS' || marksheetStatus !== 'SUCCESS') {
        setError('Please upload all three required certificates before proceeding');
        return;
      }
      setStep(5);
    }
  };

  const handleUpload = async (file, docType, setStatus) => {
    if (!file || !createdAppId) return;
    setStatus('UPLOADING');
    try {
      await api.uploadDocument(createdAppId, docType, file);
      setStatus('SUCCESS');
    } catch (err) {
      setStatus('FAILED');
      alert(`Upload failed for ${docType}: ` + err.message);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await api.submitApplication(createdAppId);
      navigate('/submitted', { state: { appId: createdAppId } });
    } catch (err) {
      setError(err.message || 'Failed to submit application');
      setLoading(false);
    }
  };

  const getStepIcon = (num) => {
    if (step > num) return <Check size={16} color="white" />;
    return <span>{num}</span>;
  };

  return (
    <div className="container animate-slide-in" style={{ padding: '2.5rem 1.5rem', maxWidth: '800px' }}>
      {/* Stepper */}
      <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', marginBottom: '3rem', position: 'relative' }}>
        {[
          { label: 'Personal', icon: <User size={16} /> },
          { label: 'Academic', icon: <GraduationCap size={16} /> },
          { label: 'Financial', icon: <DollarSign size={16} /> },
          { label: 'Uploads', icon: <Upload size={16} /> },
          { label: 'Review', icon: <ClipboardCheck size={16} /> }
        ].map((item, idx) => {
          const num = idx + 1;
          const isActive = step === num;
          const isCompleted = step > num;

          return (
            <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative', zIndex: 2 }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center',
                backgroundColor: isCompleted ? 'var(--accent-emerald)' : isActive ? 'var(--accent-saffron)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isActive ? 'var(--accent-saffron)' : 'var(--border-card)'}`,
                color: isActive || isCompleted ? 'white' : 'var(--text-secondary)',
                fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem', transition: 'all 0.3s ease'
              }}>
                {getStepIcon(num)}
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                {item.label}
              </span>
            </div>
          );
        })}
        <div style={{
          position: 'absolute', top: '18px', left: '10%', right: '10%', height: '2px',
          backgroundColor: 'rgba(255,255,255,0.06)', zIndex: 1
        }} />
      </div>

      {error && (
        <div style={{ backgroundColor: 'rgba(244,63,94,0.1)', color: 'var(--accent-rose)', border: '1px solid rgba(244,63,94,0.2)', padding: '0.875rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '1.5rem' }}>
        {step === 1 && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              Step 1: Personal Details
            </h3>

            <div className="form-group">
              <label className="form-label">Select Scholarship Scheme</label>
              <select
                className="form-input"
                value={selectedScholarshipId}
                onChange={e => setSelectedScholarshipId(e.target.value)}
                style={{ appearance: 'none', background: 'rgba(255,255,255,0.03)', color: 'var(--text-primary)' }}
              >
                {scholarships.map(s => (
                  <option key={s.id} value={s.id} style={{ backgroundColor: 'var(--bg-dark)' }}>
                    {s.title} (Value: ₹{s.amount.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name (As in Aadhaar)</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-input"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label">Social Category</label>
                <select
                  className="form-input"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--text-primary)' }}
                >
                  <option value="GENERAL" style={{ backgroundColor: 'var(--bg-dark)' }}>GENERAL</option>
                  <option value="OBC" style={{ backgroundColor: 'var(--bg-dark)' }}>OBC</option>
                  <option value="SC" style={{ backgroundColor: 'var(--bg-dark)' }}>SC</option>
                  <option value="ST" style={{ backgroundColor: 'var(--bg-dark)' }}>ST</option>
                  <option value="MINORITIES" style={{ backgroundColor: 'var(--bg-dark)' }}>MINORITIES</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">12-Digit Aadhaar Number</label>
              <input
                type="text"
                className="form-input"
                maxLength="12"
                placeholder="123456789012"
                value={aadhaar}
                onChange={e => setAadhaar(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              Step 2: Academic Record
            </h3>

            <div className="form-group">
              <label className="form-label">Institution / College Name</label>
              <input
                type="text"
                className="form-input"
                value={college}
                onChange={e => setCollege(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Course / Program</label>
              <input
                type="text"
                className="form-input"
                value={course}
                onChange={e => setCourse(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Current CGPA (Out of 10.0)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                className="form-input"
                placeholder="8.50"
                value={cgpa}
                onChange={e => setCgpa(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              Step 3: Financial Details
            </h3>

            <div className="form-group">
              <label className="form-label">Annual Family Income (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="200000"
                value={income}
                onChange={e => setIncome(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Parent / Guardian Occupation</label>
              <input
                type="text"
                className="form-input"
                value={occupation}
                onChange={e => setOccupation(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Bank Account Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="918273645012"
                  value={bankAccount}
                  onChange={e => setBankAccount(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label">IFSC Code</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="SBIN0001234"
                  value={ifsc}
                  onChange={e => setIfsc(e.target.value.toUpperCase())}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              Step 4: Upload Certificates
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>
              AI OCR will parse and verify details from these files immediately. (Format: PDF, PNG, JPG)
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ padding: '1.25rem', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Aadhaar Card Scan</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginTop: '0.125rem' }}>Verification for UID number: {aadhaar}</p>
                </div>
                <div>
                  {aadhaarStatus === 'SUCCESS' ? (
                    <span style={{ color: 'var(--accent-emerald)', fontSize: '0.875rem', fontWeight: 600 }}>✓ Uploaded</span>
                  ) : (
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={e => {
                        const file = e.target.files[0];
                        setAadhaarFile(file);
                        handleUpload(file, 'AADHAAR', setAadhaarStatus);
                      }}
                      disabled={aadhaarStatus === 'UPLOADING'}
                    />
                  )}
                </div>
              </div>

              <div style={{ padding: '1.25rem', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Income Certificate Scan</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginTop: '0.125rem' }}>Income limit matches: ₹{income}</p>
                </div>
                <div>
                  {incomeStatus === 'SUCCESS' ? (
                    <span style={{ color: 'var(--accent-emerald)', fontSize: '0.875rem', fontWeight: 600 }}>✓ Uploaded</span>
                  ) : (
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={e => {
                        const file = e.target.files[0];
                        setIncomeFile(file);
                        handleUpload(file, 'INCOME_CERTIFICATE', setIncomeStatus);
                      }}
                      disabled={incomeStatus === 'UPLOADING'}
                    />
                  )}
                </div>
              </div>

              <div style={{ padding: '1.25rem', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Academic Marksheet Scan</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginTop: '0.125rem' }}>CGPA matches: {cgpa}</p>
                </div>
                <div>
                  {marksheetStatus === 'SUCCESS' ? (
                    <span style={{ color: 'var(--accent-emerald)', fontSize: '0.875rem', fontWeight: 600 }}>✓ Uploaded</span>
                  ) : (
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={e => {
                        const file = e.target.files[0];
                        setMarksheetFile(file);
                        handleUpload(file, 'MARKSHEET', setMarksheetStatus);
                      }}
                      disabled={marksheetStatus === 'UPLOADING'}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              Step 5: Review Summary
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase' }}>Full Name</p>
                <p style={{ fontWeight: 700, marginTop: '0.125rem', marginBottom: '1rem' }}>{name}</p>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase' }}>Category & DOB</p>
                <p style={{ fontWeight: 700, marginTop: '0.125rem', marginBottom: '1rem' }}>{category} | {dob}</p>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase' }}>Aadhaar Number</p>
                <p style={{ fontWeight: 700, marginTop: '0.125rem', marginBottom: '1rem' }}>{aadhaar}</p>
              </div>

              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase' }}>College & Program</p>
                <p style={{ fontWeight: 700, marginTop: '0.125rem', marginBottom: '1rem' }}>{college} | {course}</p>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase' }}>CGPA & Income</p>
                <p style={{ fontWeight: 700, marginTop: '0.125rem', marginBottom: '1rem' }}>{cgpa} CGPA | ₹{parseInt(income).toLocaleString()}/year</p>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase' }}>Bank Details</p>
                <p style={{ fontWeight: 700, marginTop: '0.125rem', marginBottom: '1rem' }}>{bankAccount} ({ifsc})</p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-card)', paddingTop: '1.25rem', marginTop: '1rem' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Uploaded Files</p>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--accent-emerald)' }}>✓ Aadhaar Card Uploaded</span>
                <span style={{ color: 'var(--accent-emerald)' }}>✓ Income Certificate Uploaded</span>
                <span style={{ color: 'var(--accent-emerald)' }}>✓ Academic Marksheet Uploaded</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="btn btn-secondary flex-center"
            disabled={loading}
          >
            <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
            Back
          </button>
        ) : (
          <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
            Cancel
          </button>
        )}

        {step < 5 ? (
          <button
            onClick={handleNextStep}
            className="btn btn-primary flex-center"
            disabled={loading}
          >
            {loading ? 'Validating...' : 'Next Step'}
            <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="btn btn-primary flex-center"
            disabled={loading}
            style={{ backgroundColor: 'var(--accent-emerald)' }}
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ApplyScholarship;
