import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Search,
  Calendar,
  Filter,
  FileEdit,
  Archive
} from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import BackButton from '../../components/common/BackButton';

const SolvedCasesPage = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

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
                Solved Cases
              </h2>
              <span className="badge badge-green">Archive</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              Historical record of successfully concluded investigations, judicial disposals, and convictions
            </p>
          </div>
        </div>

        {/* Update / Edit option */}
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => navigate('/dashboard/active-cases/update')}
        >
          <FileEdit size={15} />
          Update Case Record
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          {/* Search bar */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              className="form-input has-icon-left"
              placeholder="Search solved cases archive..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ height: '38px', fontSize: '0.84rem' }}
            />
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} color="var(--color-text-muted)" />
              <select
                className="form-input"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                style={{ height: '38px', padding: '0 0.75rem', fontSize: '0.8125rem', width: '150px' }}
              >
                <option value="ALL">All Closure Dates</option>
                <option value="THIS_YEAR">This Year</option>
                <option value="LAST_YEAR">Previous Year</option>
                <option value="OLDER">Older than 2 Years</option>
              </select>
            </div>

            <select
              className="form-input"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ height: '38px', padding: '0 0.75rem', fontSize: '0.8125rem', width: '160px' }}
            >
              <option value="ALL">All Case Types</option>
              <option value="CYBER">Cyber Crime</option>
              <option value="FINANCIAL">Financial Fraud</option>
              <option value="NARCOTICS">Narcotics Supply</option>
              <option value="ORGANIZED">Organized Syndicate</option>
            </select>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={14} color="var(--color-text-muted)" />
              <select
                className="form-input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ height: '38px', padding: '0 0.75rem', fontSize: '0.8125rem', width: '170px' }}
              >
                <option value="ALL">All Disposed Status</option>
                <option value="CONVICTED">Conviction Secured</option>
                <option value="DISPOSED">Judicially Disposed</option>
                <option value="ACQUITTED">Acquitted / Closed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Solved Cases Table with empty state: Strictly "No solved cases available" */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Case Type</th>
              <th>Date Closed</th>
              <th>Assigned Officer</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} style={{ padding: 0 }}>
                <EmptyState
                  icon={Archive}
                  title="No solved cases available"
                  description="No historical concluded case dossiers are currently indexed. Disposed records will be accessible upon syncing with the court & CCTNS repository."
                  badgeText="Archive Empty"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SolvedCasesPage;
