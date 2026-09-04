import React, { useState } from 'react';
import {
  UserCheck,
  Search,
  SlidersHorizontal,
  ShieldAlert,
  User,
  History,
  FileText,
  Users,
  Share2,
  Clock,
  AlertTriangle,
  BrainCircuit,
  Lock,
  EyeOff,
  Filter
} from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import BackButton from '../../components/common/BackButton';

const suspectSections = [
  {
    id: 'basic_details',
    title: 'Basic Details',
    icon: User,
    description: 'Biometric identifiers, legal aliases, state registration number, and physical descriptors.'
  },
  {
    id: 'case_history',
    title: 'Case History',
    icon: History,
    description: 'Chronological summary of prior investigations, arrests, trials, and judicial outcomes.'
  },
  {
    id: 'fir_connections',
    title: 'FIR Connections',
    icon: FileText,
    description: 'Direct FIR citations, relevant IPC/BNS sections, and charges framed by investigating officers.'
  },
  {
    id: 'known_associates',
    title: 'Known Associates',
    icon: Users,
    description: 'Linked co-conspirators, financial handlers, shell entity directors, and facilitators.'
  },
  {
    id: 'network_connections',
    title: 'Network Connections',
    icon: Share2,
    description: 'Graph centrality scores, telecommunication link clusters, and digital transaction flows.'
  },
  {
    id: 'investigation_timeline',
    title: 'Investigation Timeline',
    icon: Clock,
    description: 'Audited log of surveillance events, search warrants executed, and evidence seizures.'
  },
  {
    id: 'risk_threat_analysis',
    title: 'Risk/Threat Analysis',
    icon: AlertTriangle,
    description: 'Dynamic flight risk calculation, recidivism index, and potential weapon/violence flags.'
  },
  {
    id: 'ai_analysis',
    title: 'AI Analysis',
    icon: BrainCircuit,
    description: 'Neural network anomaly detection, modus operandi (M.O.) pattern matching across multi-state crimes.'
  }
];

const SuspectDetailsPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header with Back Button */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BackButton to="/dashboard" label="Back" />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                Suspect Details
              </h2>
              <span className="badge badge-red">RESTRICTED // LEVEL-4</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              Target dossier inquiry for verified criminal syndicate subjects and persons of interest
            </p>
          </div>
        </div>
      </div>

      {/* Prominent Legal / Authorization Notice */}
      <div style={{
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <ShieldAlert size={20} color="var(--color-accent-danger)" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.8125rem', color: '#FECACA', lineHeight: 1.5 }}>
          <strong>Statutory Compliance Warning:</strong> Information is accessible only to authorized personnel and subject to applicable legal and departmental permissions. All searches are recorded with timestamped audit trails.
        </div>
      </div>

      {/* Search Field & Controls */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <form onSubmit={handleSearch}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                className="form-input has-icon-left"
                placeholder="Enter authorized suspect/case identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={{ height: '46px', fontSize: '0.9rem' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ height: '46px', padding: '0 1.75rem', fontWeight: 600 }}
            >
              <Search size={16} />
              Search Dossier
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ height: '46px', padding: '0 1.25rem' }}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <SlidersHorizontal size={16} />
              Advanced Filters
            </button>
          </div>
        </form>

        {/* Advanced Filters Drawer */}
        {showAdvancedFilters && (
          <div
            className="animate-fade-in"
            style={{
              marginTop: '1.25rem',
              padding: '1rem 1.25rem',
              backgroundColor: 'rgba(8, 17, 45, 0.7)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem'
            }}
          >
            <div>
              <label className="form-label">
                <Filter size={13} /> Identifier Classification
              </label>
              <select className="form-input" style={{ height: '36px', fontSize: '0.8125rem' }}>
                <option>All Identifiers (Service ID, Case Dossier)</option>
                <option>Fingerprint / Biometric Reference</option>
                <option>Digital Entity / Phone Hash</option>
                <option>Vehicle Registration</option>
              </select>
            </div>

            <div>
              <label className="form-label">
                <Lock size={13} /> Clearance Authorization Level
              </label>
              <select className="form-input" style={{ height: '36px', fontSize: '0.8125rem' }}>
                <option>Level 3 (Investigating Officer)</option>
                <option>Level 4 (Supervisory Command)</option>
                <option>Level 5 (Special Prosecutor / Magistrate)</option>
              </select>
            </div>

            <div>
              <label className="form-label">
                <History size={13} /> Dossier Retention Period
              </label>
              <select className="form-input" style={{ height: '36px', fontSize: '0.8125rem' }}>
                <option>Active Records Only</option>
                <option>Include Historical / Expunged (Subject to Court Order)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Primary Empty State Banner: Strictly "No suspect records available" */}
      <div className="card">
        <EmptyState
          icon={UserCheck}
          title="No suspect records available"
          description={
            hasSearched
              ? `No authorized suspect records found for "${identifier}". Verify the identifier or ensure connection with the Central Suspect Database.`
              : 'Enter an authorized suspect or case identifier to retrieve verified dossier files from the central database.'
          }
          badgeText="Restricted Registry"
        />
      </div>

      {/* Target Subject Overview Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <EyeOff size={16} color="var(--color-text-muted)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
            Dossier Sections ({suspectSections.length} Intelligence Modules)
          </span>
        </div>
        <span className="badge badge-gray">No Profile Loaded</span>
      </div>

      {/* 8 Information Sections - All showing empty state ready for backend */}
      <div className="grid-2">
        {suspectSections.map((sec) => {
          const Icon = sec.icon;
          return (
            <div
              key={sec.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.5rem',
                backgroundColor: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)'
              }}
            >
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(0, 180, 216, 0.1)',
                      border: '1px solid rgba(0, 180, 216, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-primary)'
                    }}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        {sec.title}
                      </h3>
                    </div>
                  </div>
                  <span className="badge badge-gray" style={{ fontSize: '0.65rem' }}>
                    Awaiting Input
                  </span>
                </div>

                <p style={{
                  fontSize: '0.78rem',
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.45,
                  marginBottom: '1rem'
                }}>
                  {sec.description}
                </p>
              </div>

              {/* Empty Placeholder */}
              <div style={{
                padding: '1.25rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(8, 17, 45, 0.65)',
                border: '1px dashed var(--color-border)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                  fontStyle: 'italic'
                }}>
                  No suspect records available
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>
                  Awaiting authorized identifier match from central registry.
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SuspectDetailsPage;
