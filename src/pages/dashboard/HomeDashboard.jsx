import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FolderLock,
  CheckCircle2,
  FileText,
  UserCheck,
  Search,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  FileSearch
} from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';

const summaryCardConfig = [
  {
    title: 'Active Cases',
    icon: FolderLock,
    color: '#00B4D8',
    bg: 'rgba(0, 180, 216, 0.12)',
    route: '/dashboard/active-cases',
    tag: 'Investigation Stage'
  },
  {
    title: 'Solved Cases',
    icon: CheckCircle2,
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.12)',
    route: '/dashboard/solved-cases',
    tag: 'Disposed / Closed'
  },
  {
    title: 'FIR Records',
    icon: FileText,
    color: '#E0A96D',
    bg: 'rgba(224, 169, 109, 0.12)',
    route: '/dashboard/fir-records',
    tag: 'Registered Repository'
  },
  {
    title: 'Suspect Profiles',
    icon: UserCheck,
    color: '#A78BFA',
    bg: 'rgba(167, 139, 250, 0.12)',
    route: '/dashboard/suspect-details',
    tag: 'Restricted Access'
  }
];

const searchCategories = [
  'All Categories',
  'Active Cases',
  'Solved Cases',
  'FIR',
  'Suspect Details',
  'Case ID',
  'Officer/Investigation ID'
];

const HomeDashboard = () => {
  const { officerId } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setHasSearched(true);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner (No "Welcome, Officer" heading) */}
      <div 
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(14, 28, 70, 0.9) 0%, rgba(8, 17, 45, 0.95) 100%)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          padding: '1.75rem 2rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
            <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              Authorized Session Active
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              • Classification: LAW ENFORCEMENT SENSITIVE
            </span>
          </div>

          <h2 style={{
            fontSize: '1.65rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--color-text-primary)',
            marginBottom: '0.25rem'
          }}>
            Criminal Network Analysis Dashboard
          </h2>

          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            Law Enforcement Intelligence & Central Case Registry Portal
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          backgroundColor: 'rgba(8, 17, 45, 0.6)',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)'
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Officer Credential
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-accent-gold)', fontFamily: 'var(--font-mono)' }}>
              {officerId}
            </div>
          </div>
          <div style={{ height: '28px', width: '1px', backgroundColor: 'var(--color-border)' }} />
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              System Integrity
            </div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-accent-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} /> Ready / Uncompromised
            </div>
          </div>
        </div>
      </div>

      {/* Global Search Section */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Central Intelligence & Case Search
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              Cross-reference case repositories, FIR entries, and suspect identifier tags
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
          >
            <SlidersHorizontal size={14} />
            {isFilterDrawerOpen ? 'Hide Filters' : 'Filter Options'}
          </button>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <Search 
              size={18} 
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)'
              }} 
            />
            <input
              type="text"
              className="form-input has-icon-left"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cases, FIRs, suspects, case IDs..."
              style={{ height: '46px', fontSize: '0.9rem' }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ height: '46px', padding: '0 1.5rem', fontWeight: 600 }}
          >
            <Search size={16} />
            Search
          </button>
        </form>

        {/* Category Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          paddingTop: '1rem',
          marginTop: '0.75rem',
          borderTop: '1px solid rgba(30, 45, 90, 0.5)'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
            Category:
          </span>
          {searchCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveCategory(cat);
                if (hasSearched) setHasSearched(true);
              }}
              style={{
                background: activeCategory === cat ? 'rgba(0, 180, 216, 0.2)' : 'rgba(8, 17, 45, 0.6)',
                border: activeCategory === cat ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                color: activeCategory === cat ? '#FFFFFF' : 'var(--color-text-secondary)',
                fontSize: '0.78rem',
                fontWeight: activeCategory === cat ? 600 : 400,
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Extended filters (toggled) */}
        {isFilterDrawerOpen && (
          <div 
            className="animate-fade-in"
            style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: 'rgba(8, 17, 45, 0.7)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px'
            }}
          >
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>
                Jurisdiction / Station
              </label>
              <select className="form-input" style={{ height: '34px', fontSize: '0.8rem' }}>
                <option>All Police Stations</option>
                <option disabled>Central Cyber Crime Branch</option>
                <option disabled>Special Investigation Cell</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>
                Timeframe
              </label>
              <select className="form-input" style={{ height: '34px', fontSize: '0.8rem' }}>
                <option>All Time</option>
                <option>Past 24 Hours</option>
                <option>Past 30 Days</option>
                <option>Custom Date Range</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>
                Classification Status
              </label>
              <select className="form-input" style={{ height: '34px', fontSize: '0.8rem' }}>
                <option>All Statuses</option>
                <option>Under Investigation</option>
                <option>Charge-sheeted</option>
                <option>Pending Forensic Analysis</option>
              </select>
            </div>
          </div>
        )}

        {/* Search Results Area - Strictly "No results found" when query run */}
        {hasSearched && (
          <div style={{ marginTop: '1.5rem' }}>
            <EmptyState
              icon={FileSearch}
              title="No results found"
              description={`Zero matching law-enforcement records for "${searchQuery || activeCategory}". Connect backend database or refine query parameters.`}
              badgeText="Zero Matches"
              actionText="Reset Search"
              onAction={() => {
                setSearchQuery('');
                setHasSearched(false);
              }}
            />
          </div>
        )}
      </div>

      {/* Core Intelligence Repositories (4 Cards showing "No data available") */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Core Intelligence Repositories
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              Live index status across connected law-enforcement databases
            </p>
          </div>
        </div>

        <div className="grid-4">
          {summaryCardConfig.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="card card-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  padding: '1.25rem'
                }}
                onClick={() => navigate(card.route)}
              >
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: card.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: card.color
                    }}>
                      <Icon size={20} />
                    </div>
                    <span className="badge badge-gray" style={{ fontSize: '0.65rem' }}>
                      {card.tag}
                    </span>
                  </div>

                  <h4 style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    marginBottom: '0.25rem'
                  }}>
                    {card.title}
                  </h4>

                  {/* NO FAKE DATA: Strictly "No data available" */}
                  <div style={{
                    margin: '0.75rem 0',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(8, 17, 45, 0.6)',
                    border: '1px dashed var(--color-border)',
                    textAlign: 'center'
                  }}>
                    <span style={{
                      fontSize: '0.8125rem',
                      color: 'var(--color-text-muted)',
                      fontStyle: 'italic',
                      fontWeight: 500
                    }}>
                      No data available
                    </span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid rgba(30, 45, 90, 0.4)',
                  fontSize: '0.75rem',
                  color: 'var(--color-primary)'
                }}>
                  <span>Access Module</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
