import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderPlus,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Hash,
  FileText,
  User,
  Layers,
  Flag
} from 'lucide-react';
import BackButton from '../../components/common/BackButton';

const caseTypeOptions = [
  'Select Case Type',
  'Cyber Crime & Digital Fraud',
  'Financial Crimes & Money Laundering',
  'Organized Syndicate Conspiracy',
  'Narcotics & Illicit Trafficking',
  'Identity Theft & Forgery',
  'Critical Infrastructure Intrusion'
];

const priorityOptions = [
  'Select Priority',
  'Critical',
  'High',
  'Medium',
  'Low'
];

const statusOptions = [
  'Select Status',
  'Under Investigation',
  'Pending Forensic Analysis',
  'Charge-sheeted',
  'Transferred / Escalated'
];

const AddCasePage = () => {
  const navigate = useNavigate();

  // Form states - initially strictly empty
  const [formData, setFormData] = useState({
    caseId: '',
    caseTitle: '',
    caseType: '',
    firNumber: '',
    date: '',
    priority: '',
    assignedOfficer: '',
    description: '',
    status: ''
  });

  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.caseId.trim()) {
      errs.caseId = 'Case ID is required.';
    }
    if (!formData.caseTitle.trim()) {
      errs.caseTitle = 'Case Title is required.';
    }
    if (!formData.caseType || formData.caseType === 'Select Case Type') {
      errs.caseType = 'Please select a valid Case Type.';
    }
    if (!formData.status || formData.status === 'Select Status') {
      errs.status = 'Please select a Case Status.';
    }
    if (!formData.priority || formData.priority === 'Select Priority') {
      errs.priority = 'Please select a Priority level.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveCase = (e) => {
    e.preventDefault();
    if (validate()) {
      // Structured for future API integration (POST /api/v1/cases)
      // Notice: Do NOT store fake persistent data.
      setSaveSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/active-cases');
      }, 1500);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Top Header with Back Button */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BackButton to="/dashboard/active-cases" label="Back to Active Cases" />
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              Add New Case
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              Register a new criminal investigation dossier for authorized tracking
            </p>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div style={{
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: 'var(--color-accent-success)',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle2 size={18} />
          <span>Case data validated successfully. Returning to Active Cases...</span>
        </div>
      )}

      {/* Main Form Card */}
      <div className="card" style={{ padding: '2rem' }}>
        <form onSubmit={handleSaveCase} noValidate>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem'
          }}>
            {/* Case ID */}
            <div className="form-group">
              <label className="form-label" htmlFor="caseId">
                <Hash size={14} />
                Case ID <span style={{ color: 'var(--color-accent-danger)' }}>*</span>
              </label>
              <input
                id="caseId"
                type="text"
                className="form-input"
                placeholder="e.g. CR-2026-0091"
                value={formData.caseId}
                onChange={(e) => handleChange('caseId', e.target.value)}
              />
              {errors.caseId && (
                <div className="form-error">
                  <AlertCircle size={13} />
                  <span>{errors.caseId}</span>
                </div>
              )}
            </div>

            {/* Case Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="caseTitle">
                <FileText size={14} />
                Case Title <span style={{ color: 'var(--color-accent-danger)' }}>*</span>
              </label>
              <input
                id="caseTitle"
                type="text"
                className="form-input"
                placeholder="Enter investigation title"
                value={formData.caseTitle}
                onChange={(e) => handleChange('caseTitle', e.target.value)}
              />
              {errors.caseTitle && (
                <div className="form-error">
                  <AlertCircle size={13} />
                  <span>{errors.caseTitle}</span>
                </div>
              )}
            </div>

            {/* Case Type */}
            <div className="form-group">
              <label className="form-label" htmlFor="caseType">
                <Layers size={14} />
                Case Type <span style={{ color: 'var(--color-accent-danger)' }}>*</span>
              </label>
              <select
                id="caseType"
                className="form-input"
                value={formData.caseType}
                onChange={(e) => handleChange('caseType', e.target.value)}
              >
                {caseTypeOptions.map((opt) => (
                  <option key={opt} value={opt === 'Select Case Type' ? '' : opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.caseType && (
                <div className="form-error">
                  <AlertCircle size={13} />
                  <span>{errors.caseType}</span>
                </div>
              )}
            </div>

            {/* FIR Number */}
            <div className="form-group">
              <label className="form-label" htmlFor="firNumber">
                <FileText size={14} />
                FIR Number
              </label>
              <input
                id="firNumber"
                type="text"
                className="form-input"
                placeholder="e.g. FIR-2026-441"
                value={formData.firNumber}
                onChange={(e) => handleChange('firNumber', e.target.value)}
              />
            </div>

            {/* Date */}
            <div className="form-group">
              <label className="form-label" htmlFor="date">
                <Calendar size={14} />
                Registration Date
              </label>
              <input
                id="date"
                type="date"
                className="form-input"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
              />
            </div>

            {/* Priority */}
            <div className="form-group">
              <label className="form-label" htmlFor="priority">
                <Flag size={14} />
                Priority Level <span style={{ color: 'var(--color-accent-danger)' }}>*</span>
              </label>
              <select
                id="priority"
                className="form-input"
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
              >
                {priorityOptions.map((opt) => (
                  <option key={opt} value={opt === 'Select Priority' ? '' : opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.priority && (
                <div className="form-error">
                  <AlertCircle size={13} />
                  <span>{errors.priority}</span>
                </div>
              )}
            </div>

            {/* Assigned Officer */}
            <div className="form-group">
              <label className="form-label" htmlFor="assignedOfficer">
                <User size={14} />
                Assigned Officer / Badge ID
              </label>
              <input
                id="assignedOfficer"
                type="text"
                className="form-input"
                placeholder="e.g. OFF-84920"
                value={formData.assignedOfficer}
                onChange={(e) => handleChange('assignedOfficer', e.target.value)}
              />
            </div>

            {/* Status */}
            <div className="form-group">
              <label className="form-label" htmlFor="status">
                <Layers size={14} />
                Case Status <span style={{ color: 'var(--color-accent-danger)' }}>*</span>
              </label>
              <select
                id="status"
                className="form-input"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt === 'Select Status' ? '' : opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.status && (
                <div className="form-error">
                  <AlertCircle size={13} />
                  <span>{errors.status}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label className="form-label" htmlFor="description">
              <FileText size={14} />
              Case Synopsis & Narrative Summary
            </label>
            <textarea
              id="description"
              className="form-input"
              rows={4}
              placeholder="Enter investigative details, suspect modus operandi, or evidentiary notes..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Buttons: Save Case, Cancel, Back */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '2rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--color-border)',
            flexWrap: 'wrap'
          }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard/active-cases')}
            >
              Back
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              <X size={16} />
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
            >
              <Save size={16} />
              Save Case
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCasePage;
