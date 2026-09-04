import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  FolderLock,
  CheckCircle2,
  FileText,
  UserCheck,
  Hash,
  BadgeAlert,
  FileSearch,
  Calendar,
  Layers,
  MapPin,
  RefreshCw
} from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import BackButton from '../../components/common/BackButton';

const categoryList = [
  { id: 'all', label: 'All Categories', icon: Layers },
  { id: 'active_cases', label: 'Active Cases', icon: FolderLock },
  { id: 'solved_cases', label: 'Solved Cases', icon: CheckCircle2 },
  { id: 'fir', label: 'FIR', icon: FileText },
  { id: 'suspect_details', label: 'Suspect Details', icon: UserCheck },
  { id: 'case_id', label: 'Case ID', icon: Hash },
  { id: 'officer_id', label: 'Officer/Investigation ID', icon: BadgeAlert }
];

const GlobalSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [hasExecutedSearch, setHasExecutedSearch] = useState(Boolean(initialQuery));

  // Sync if query param changes
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      setHasExecutedSearch(true);
    }
  }, [initialQuery]);

  const handleSearch = (e) => {
    e?.preventDefault();
    setHasExecutedSearch(true);
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleReset = () => {
    setQuery('');
    setSelectedCategory('all');
    setHasExecutedSearch(false);
    setSearchParams({});
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header with Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <BackButton to="/dashboard" label="Back" />
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
            Global Intelligence & Record Search
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            Query centralized law-enforcement indices across active cases, closed investigations, and registered FIRs
          </p>
        </div>
      </div>

      {/* Main Search Panel */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <form onSubmit={handleSearch}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '1.1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)'
                }}
              />
              <input
                type="text"
                className="form-input has-icon-left"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cases, FIRs, suspects, case IDs..."
                style={{ height: '48px', fontSize: '0.95rem' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ height: '48px', padding: '0 1.75rem', fontWeight: 600 }}
            >
              <Search size={16} />
              Search
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ height: '48px', padding: '0 1.25rem' }}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={16} />
              {showFilters ? 'Hide Filters' : 'Filters'}
            </button>
          </div>
        </form>

        {/* Category Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          paddingTop: '1.25rem',
          marginTop: '1.25rem',
          borderTop: '1px solid rgba(30, 45, 90, 0.5)'
        }}>
          {categoryList.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  if (hasExecutedSearch) handleSearch();
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: isSelected ? 'rgba(0, 180, 216, 0.2)' : 'rgba(8, 17, 45, 0.5)',
                  border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  color: isSelected ? '#FFFFFF' : 'var(--color-text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: isSelected ? 600 : 400,
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={14} color={isSelected ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div
            className="animate-fade-in"
            style={{
              marginTop: '1.25rem',
              padding: '1.25rem',
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
                <MapPin size={13} /> Jurisdiction Zone
              </label>
              <select className="form-input" style={{ height: '36px', fontSize: '0.8125rem' }}>
                <option>All Zones / Districts</option>
                <option disabled>North Zone Cyber Command</option>
                <option disabled>South Zone Cyber Command</option>
                <option disabled>Special Crime Branch Headquarters</option>
              </select>
            </div>

            <div>
              <label className="form-label">
                <Calendar size={13} /> Filing Date Window
              </label>
              <select className="form-input" style={{ height: '36px', fontSize: '0.8125rem' }}>
                <option>Any Filing Date</option>
                <option>Past 7 Days</option>
                <option>Past 30 Days</option>
                <option>Current Financial Year</option>
              </select>
            </div>

            <div>
              <label className="form-label">
                <Layers size={13} /> Crime Categorization
              </label>
              <select className="form-input" style={{ height: '36px', fontSize: '0.8125rem' }}>
                <option>All IPC / BNS & Special Acts</option>
                <option disabled>Financial Fraud & Cyber Embezzlement</option>
                <option disabled>Narcotics & Illicit Trafficking</option>
                <option disabled>Organized Syndicate Conspiracy</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Container: STRICTLY "No records found." */}
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
              Search Query Results
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Target Index: {categoryList.find(c => c.id === selectedCategory)?.label}
            </span>
          </div>
          <span className="badge badge-gray">0 Results Found</span>
        </div>

        <EmptyState
          icon={FileSearch}
          title="No results found"
          description={
            hasExecutedSearch
              ? `No authorized records or suspect profiles matched your search "${query || selectedCategory}". Please verify reference IDs or establish connection with the central registry.`
              : 'Execute a search query above to query authorized law-enforcement records.'
          }
          badgeText="Zero Matches"
          actionText={hasExecutedSearch ? "Clear Query" : undefined}
          onAction={handleReset}
        />
      </div>
    </div>
  );
};

export default GlobalSearchPage;
