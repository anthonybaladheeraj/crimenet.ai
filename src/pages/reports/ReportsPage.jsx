import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  Share2,
  FolderLock,
  PlusCircle,
  Download,
  Calendar,
  Shield,
  Layers,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';

const reportTabs = [
  { id: 'case_reports', label: 'Case Reports', icon: FolderLock },
  { id: 'fir_reports', label: 'FIR Reports', icon: FileText },
  { id: 'network_reports', label: 'Network Analysis Reports', icon: Share2 },
  { id: 'investigation_summaries', label: 'Investigation Summaries', icon: FileSpreadsheet },
];

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('case_reports');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [reportType, setReportType] = useState('CASE_COMPREHENSIVE');
  const [timeframe, setTimeframe] = useState('MONTH');
  const [generationNotice, setGenerationNotice] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    setGenerationNotice(true);
    setTimeout(() => {
      setGenerationNotice(false);
      setIsGenerateModalOpen(false);
    }, 2000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              Investigation & Intelligence Reports
            </h2>
            <span className="badge badge-blue">Audit Compliant</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            Cryptographically sealed intelligence briefs, court filings, and syndicate link analyses
          </p>
        </div>

        {/* Generate Report Button */}
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setIsGenerateModalOpen(true)}
        >
          <PlusCircle size={16} />
          Generate Report
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: '0.5rem'
      }}>
        {reportTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.625rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'rgba(0, 180, 216, 0.15)' : 'transparent',
                border: isActive ? '1px solid var(--color-primary)' : '1px solid transparent',
                color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.84rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} color={isActive ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Reports Display Card */}
      <div className="card">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: '1rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>
              {reportTabs.find(t => t.id === activeTab)?.label}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Showing generated dossiers under classification authority
            </span>
          </div>
          <span className="badge badge-gray">0 Reports Available</span>
        </div>

        {/* Empty State: Strictly "No reports available." */}
        <EmptyState
          icon={FileSpreadsheet}
          title="No reports available."
          description={`There are currently no saved or pre-compiled ${reportTabs.find(t => t.id === activeTab)?.label.toLowerCase()} in this archive. Use the "Generate Report" engine to draft a court brief or investigation summary.`}
          badgeText="Archive Empty"
          actionText="Draft New Report"
          onAction={() => setIsGenerateModalOpen(true)}
        />
      </div>

      {/* Generate Report Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Compile Departmental Intelligence Report"
      >
        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="form-label">
              <Layers size={14} /> Report Type & Template
            </label>
            <select
              className="form-input"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="CASE_COMPREHENSIVE">Comprehensive Case Investigation Dossier</option>
              <option value="FIR_CROSS_REF">FIR Cross-Jurisdictional Cross-Reference Brief</option>
              <option value="NETWORK_EVIDENCE">Syndicate Network & Associate Linkage Brief</option>
              <option value="EXECUTIVE_SUMMARY">Command Summary for Supervisory Officers</option>
            </select>
          </div>

          <div>
            <label className="form-label">
              <Calendar size={14} /> Intelligence Timeline
            </label>
            <select
              className="form-input"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="7_DAYS">Past 7 Days</option>
              <option value="MONTH">Current Month</option>
              <option value="QUARTER">Current Quarter</option>
              <option value="INCEPTION">Case Inception to Present</option>
            </select>
          </div>

          <div>
            <label className="form-label">
              <Shield size={14} /> Security Classification Label
            </label>
            <select className="form-input">
              <option>SECRET // LAW ENFORCEMENT SENSITIVE (Default)</option>
              <option>CONFIDENTIAL // JUDICIAL SUBMISSION</option>
              <option>RESTRICTED // INTER-STATE SHARING</option>
            </select>
          </div>

          {generationNotice && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-accent-success)',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} />
              <span>Report template initialized. Ready for backend rendering queue.</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsGenerateModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
            >
              <Sparkles size={15} />
              Queue Report Compilation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ReportsPage;
