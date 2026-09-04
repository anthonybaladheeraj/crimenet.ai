import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileEdit,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Hash,
  FileText,
  User,
  Layers,
  Flag,
  MessageSquare,
  Database
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
  'Transferred / Escalated',
  'Judicially Disposed',
  'Closed / Solved'
];

const UpdateCasePage = () => {
  const navigate = useNavigate();

  // Initially empty form - ready for backend data population
  const [targetCaseId, setTargetCaseId] = useState('');
  const [formData, setFormData] = useState({
    caseTitle: '',
    caseType: '',
    firNumber: '',
    priority: '',
    assignedOfficer: '',
    description: '',
    status: '',
    caseUpdates: ''
  });

  const [errors, setErrors] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!targetCaseId.trim()) {
      errs.targetCaseId = 'Please enter or select a Case ID to update.';
    }
    if (!formData.caseTitle.trim()) {
      errs.caseTitle = 'Case Title is required.';
    }
    if (!formData.status || formData.status === 'Select Status') {
      errs.status = 'Please select a Case Status.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleUpdateCase = (e) => {
    e.preventDefault();
    if (validate()) {
      // Structured for future API integration (PUT /api/v1/cases/:id)
      setUpdateSuccess(true);
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
              Update Case
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              Modify investigation records, update case status, or append forensic progress notes
            </p>
          </div>
        </div>
      </div>

      {/* Backend Integration Note */}
      <div style={{
        padding: '0.875rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'rgba(0, 180, 216, 0.08)',
        border: '1px solid rgba(0, 180, 216, 0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.8125rem',
        color: 'var(--color-text-secondary)'
      }}>
        <Database size={16} color="var(--color-primary)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Backend Ready:</strong> When backend database is connected, selecting a Case ID will automatically populate this form with the corresponding investigation file.
        </span>
      </div>

      {updateSuccess && (
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
          <span>Case modifications validated successfully. Returning to case directory...</span>
        </div>
      )}

      {/* Main Update Form Card */}
      <div className="card" style={{ padding: '2rem' }}>
        <form onSubmit={handleUpdateCase} noValidate>
          {/* Target Case ID selector */}
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" htmlFor="targetCaseId">
              <Hash size={14} />
              Target Case ID <span style={{ color: 'var(--color-accent-danger)' }}>*</span>
            </label>
            <input
              id="targetCaseId"
              type="text"
              className="form-input"
              placeholder="Enter Case ID to load (e.g. CR-2026-XXXX)"
              value={targetCaseId}
              onChange={(e) => {
                setTargetCaseId(e.target.value);
                if (errors.targetCaseId) setErrors((prev) => ({ ...prev, targetCaseId: null }));
              }}
            />
            {errors.targetCaseId && (
              <div className="form-error">
                <AlertCircle size={13} />
                <span>{errors.targetCaseId}</span>
              </div>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem'
          }}>
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
                placeholder="Investigation title"
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
                Case Type
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
                placeholder="FIR reference number"
                value={formData.firNumber}
                onChange={(e) => handleChange('firNumber', e.target.value)}
              />
            </div>

            {/* Priority */}
            <div className="form-group">
              <label className="form-label" htmlFor="priority">
                <Flag size={14} />
                Priority Level
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
            </div>

            {/* Assigned Officer */}
            <div className="form-group">
              <label className="form-label" htmlFor="assignedOfficer">
                <User size={14} />
                Assigned Officer
              </label>
              <input
                id="assignedOfficer"
                type="text"
                className="form-input"
                placeholder="Officer ID"
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
              Description
            </label>
            <textarea
              id="description"
              className="form-input"
              rows={3}
              placeholder="Case description and overview..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Case Updates / Remarks */}
          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label className="form-label" htmlFor="caseUpdates">
              <MessageSquare size={14} />
              Case Updates / Remarks
            </label>
            <textarea
              id="caseUpdates"
              className="form-input"
              rows={3}
              placeholder="Enter investigative progress, judicial developments, evidence seizures, or remarks..."
              value={formData.caseUpdates}
              onChange={(e) => handleChange('caseUpdates', e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Action Buttons: Update Case, Cancel, Back */}
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
              Update Case
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCasePage;
