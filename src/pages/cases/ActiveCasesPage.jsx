import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderLock,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  PlusCircle,
  FileEdit,
  Eye,
  Info
} from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import BackButton from '../../components/common/BackButton';
import Modal from '../../components/common/Modal';

const ActiveCasesPage = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('updated');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header with Back Button and Add New Case */}
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
                Active Cases
              </h2>
              <span className="badge badge-blue">Registry</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              Ongoing criminal investigations and surveillance dossiers under active inquiry
            </p>
          </div>
        </div>

        {/* Action Buttons: Add New Case & Update Case */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/dashboard/active-cases/update')}
          >
            <FileEdit size={15} />
            Update Case
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/dashboard/active-cases/new')}
          >
            <PlusCircle size={15} />
            Add New Case
          </button>
        </div>
      </div>

      {/* Control Bar: Search, Filters, Sort */}
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
              placeholder="Search active cases by ID or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ height: '38px', fontSize: '0.84rem' }}
            />
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <SlidersHorizontal size={14} color="var(--color-text-muted)" />
              <select
                className="form-input"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                style={{ height: '38px', padding: '0 0.75rem', fontSize: '0.8125rem', width: '160px' }}
              >
                <option value="ALL">All Case Types</option>
                <option value="CYBER">Cyber Crime</option>
                <option value="FINANCIAL">Financial Fraud</option>
                <option value="ORGANIZED">Organized Crime</option>
                <option value="NARCOTICS">Narcotics</option>
              </select>
            </div>

            <select
              className="form-input"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              style={{ height: '38px', padding: '0 0.75rem', fontSize: '0.8125rem', width: '140px' }}
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowUpDown size={14} color="var(--color-text-muted)" />
              <select
                className="form-input"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ height: '38px', padding: '0 0.75rem', fontSize: '0.8125rem', width: '150px' }}
              >
                <option value="updated">Last Updated</option>
                <option value="priority">Priority</option>
                <option value="case_id">Case ID</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table Container with Empty State: Strictly "No active cases available" */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Case Type</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assigned Officer</th>
              <th>Last Updated</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7} style={{ padding: 0 }}>
                <EmptyState
                  icon={FolderLock}
                  title="No active cases available"
                  description="There are currently no active criminal cases loaded. Use 'Add New Case' to create a record or connect the database to synchronize live investigation files."
                  badgeText="Empty Registry"
                  actionText="Add New Case"
                  onAction={() => navigate('/dashboard/active-cases/new')}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveCasesPage;
