import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Search,
  Filter,
  Share2,
  Layers,
  Info,
  ShieldCheck,
  EyeOff
} from 'lucide-react';

const NetworkCanvasPlaceholder = () => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [searchEntity, setSearchEntity] = useState('');
  const [relationshipFilter, setRelationshipFilter] = useState('ALL');
  const [caseFilter, setCaseFilter] = useState('ALL');
  const [activeLegend, setActiveLegend] = useState(null);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 15, 200));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 15, 50));
  const handleReset = () => {
    setZoomLevel(100);
    setSearchEntity('');
    setRelationshipFilter('ALL');
    setCaseFilter('ALL');
  };

  return (
    <div style={{
      backgroundColor: 'var(--color-bg-card)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-lg)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Controls Toolbar */}
      <div style={{
        padding: '1rem 1.25rem',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'rgba(8, 17, 45, 0.7)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        {/* Search & Filters */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px', flex: 1, minWidth: '300px' }}>
          {/* Entity search */}
          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              className="form-input"
              value={searchEntity}
              onChange={(e) => setSearchEntity(e.target.value)}
              placeholder="Search entity node..."
              style={{ paddingLeft: '2.25rem', height: '36px', fontSize: '0.8125rem' }}
            />
          </div>

          {/* Relationship filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} color="var(--color-text-muted)" />
            <select
              value={relationshipFilter}
              onChange={(e) => setRelationshipFilter(e.target.value)}
              className="form-input"
              style={{ height: '36px', padding: '0 0.75rem', fontSize: '0.8125rem', width: '170px' }}
            >
              <option value="ALL">All Relationships</option>
              <option value="COMMUNICATION">Telecommunication Link</option>
              <option value="FINANCIAL">Financial Transaction</option>
              <option value="CO_ACCUSED">Co-Accused / Association</option>
              <option value="GEOLOCATION">Geographic Proximity</option>
              <option value="VEHICLE">Shared Conveyance</option>
            </select>
          </div>

          {/* Case filter */}
          <select
            value={caseFilter}
            onChange={(e) => setCaseFilter(e.target.value)}
            className="form-input"
            style={{ height: '36px', padding: '0 0.75rem', fontSize: '0.8125rem', width: '150px' }}
          >
            <option value="ALL">All Cases</option>
            <option value="NONE" disabled>No connected cases</option>
          </select>
        </div>

        {/* Zoom & Reset Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--color-bg-input)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden'
          }}>
            <button
              type="button"
              onClick={handleZoomOut}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-secondary)',
                padding: '6px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              padding: '0 6px',
              fontFamily: 'var(--font-mono)',
              minWidth: '42px',
              textAlign: 'center'
            }}>
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-secondary)',
                padding: '6px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setZoomLevel(100)}
            title="Fit to Screen"
          >
            <Maximize2 size={14} />
            Fit
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleReset}
            title="Reset Graph"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>

      {/* Canvas Area with radar grid and mock blueprint nodes watermark */}
      <div style={{
        height: '560px',
        position: 'relative',
        overflow: 'hidden',
        background: `
          radial-gradient(circle at center, rgba(14, 28, 70, 0.6) 0%, rgba(7, 15, 43, 0.95) 75%),
          linear-gradient(rgba(30, 45, 90, 0.15) 1px, transparent 1px),
          linear-gradient(90deg, rgba(30, 45, 90, 0.15) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 36px 36px, 36px 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Decorative radar circles */}
        <div style={{
          position: 'absolute',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          border: '1px dashed rgba(0, 180, 216, 0.12)',
          pointerEvents: 'none'
        }} className="pulse-radar" />
        <div style={{
          position: 'absolute',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          border: '1px solid rgba(0, 180, 216, 0.08)',
          pointerEvents: 'none'
        }} />

        {/* Abstract blueprint mock node outlines (watermark, zero fake data) */}
        <svg 
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.18,
            pointerEvents: 'none',
            transform: `scale(${zoomLevel / 100})`,
            transition: 'transform 0.2s ease-out'
          }}
        >
          {/* Node link lines */}
          <line x1="20%" y1="35%" x2="50%" y2="50%" stroke="#00B4D8" strokeWidth="1.5" strokeDasharray="5,5" />
          <line x1="80%" y1="30%" x2="50%" y2="50%" stroke="#00B4D8" strokeWidth="1.5" strokeDasharray="5,5" />
          <line x1="30%" y1="75%" x2="50%" y2="50%" stroke="#E0A96D" strokeWidth="1.5" strokeDasharray="5,5" />
          <line x1="70%" y1="75%" x2="50%" y2="50%" stroke="#E0A96D" strokeWidth="1.5" strokeDasharray="5,5" />
          <line x1="20%" y1="35%" x2="30%" y2="75%" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3,3" />

          {/* Node bubbles placeholder */}
          <circle cx="50%" cy="50%" r="28" fill="#111e48" stroke="#00B4D8" strokeWidth="2" />
          <circle cx="20%" cy="35%" r="20" fill="#111e48" stroke="#E0A96D" strokeWidth="1.5" />
          <circle cx="80%" cy="30%" r="20" fill="#111e48" stroke="#38BDF8" strokeWidth="1.5" />
          <circle cx="30%" cy="75%" r="22" fill="#111e48" stroke="#34D399" strokeWidth="1.5" />
          <circle cx="70%" cy="75%" r="20" fill="#111e48" stroke="#F87171" strokeWidth="1.5" />
        </svg>

        {/* Central Overlay Prompt */}
        <div 
          className="animate-fade-in"
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '520px',
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: 'rgba(12, 22, 56, 0.88)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(0, 180, 216, 0.3)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 180, 216, 0.12)',
            border: '1px solid rgba(0, 180, 216, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            color: 'var(--color-primary)'
          }}>
            <Share2 size={26} strokeWidth={1.8} />
          </div>

          <div style={{ marginBottom: '0.75rem' }}>
            <span className="badge badge-blue">Graph Engine Standby</span>
          </div>

          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginBottom: '0.75rem',
            letterSpacing: '0.02em'
          }}>
            Network visualization will appear here when authorized data is available.
          </h3>

          <p style={{
            fontSize: '0.84rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
            marginBottom: '1.25rem'
          }}>
            The AI graph reasoning engine links entities across FIR filings, call detail records (CDR), digital transactions, and intelligence notes once database authorization is established.
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(8, 17, 45, 0.7)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            fontSize: '0.75rem',
            color: 'var(--color-accent-gold)'
          }}>
            <ShieldCheck size={14} />
            <span>Ready for Neo4j / Knowledge Graph API Connector</span>
          </div>
        </div>

        {/* Legend Panel at Bottom Left */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          backgroundColor: 'rgba(8, 17, 45, 0.85)',
          backdropFilter: 'blur(6px)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          zIndex: 5
        }}>
          <div style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
            marginBottom: '6px',
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Layers size={12} />
            Entity Node Typology
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px 12px',
            fontSize: '0.72rem',
            color: 'var(--color-text-secondary)'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00B4D8' }} /> Suspect
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#E0A96D' }} /> Organization
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#34D399' }} /> Location
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F87171' }} /> Vehicle
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#A78BFA' }} /> Communication
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FBBF24' }} /> Bank / Asset
            </span>
          </div>
        </div>

        {/* Security watermark banner */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          backgroundColor: 'rgba(8, 17, 45, 0.75)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '4px 8px',
          fontSize: '0.7rem',
          color: 'var(--color-text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <EyeOff size={12} />
          <span>Zero Personal Data Displayed</span>
        </div>
      </div>
    </div>
  );
};

export default NetworkCanvasPlaceholder;
