import React, { useState } from 'react';
import {
  FileText,
  Search,
  Calendar,
  Layers,
  Hash,
  Eye
} from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import BackButton from '../../components/common/BackButton';

const FirRecordsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [firNumberFilter, setFirNumberFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

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
                FIR Records
              </h2>
              <span className="badge badge-gold">Statutory Registry</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              Official First Information Reports filed across police jurisdictions and specialized investigative units
            </p>
          </div>
        </div>
      </div>

      {/* Control Bar: Search FIR, FIR number filter, Date filter, Case category filter */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          {/* Search FIR */}
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              className="form-input has-icon-left"
              placeholder="Search FIR content, station or acts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ height: '38px', fontSize: '0.84rem' }}
            />
          </div>

          {/* FIR number filter */}
          <div style={{ position: 'relative', width: '180px' }}>
            <Hash size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Filter by FIR No..."
              value={firNumberFilter}
              onChange={(e) => setFirNumberFilter(e.target.value)}
              style={{ paddingLeft: '2rem', height: '38px', fontSize: '0.8125rem' }}
            />
          </div>

          {/* Date filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} color="var(--color-text-muted)" />
            <select
              className="form-input"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{ height: '38px', padding: '0 0.75rem', fontSize: '0.8125rem', width: '140px' }}
            >
              <option value="ALL">All Dates</option>
              <option value="TODAY">Today</option>
              <option value="PAST_WEEK">Past 7 Days</option>
              <option value="PAST_MONTH">Past 30 Days</option>
              <option value="YEAR">Current Year</option>
            </select>
          </div>

          {/* Case category filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={14} color="var(--color-text-muted)" />
            <select
              className="form-input"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ height: '38px', padding: '0 0.75rem', fontSize: '0.8125rem', width: '170px' }}
            >
              <option value="ALL">All Categories</option>
              <option value="CYBER">IT Act / Cyber Crime</option>
              <option value="FINANCIAL">PMLA / Financial Fraud</option>
              <option value="IPC">BNS / IPC Offences</option>
              <option value="NARCOTICS">NDPS Act</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Structure with Empty State: Strictly "No FIR records available" */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>FIR Number</th>
              <th>Case ID</th>
              <th>Date</th>
              <th>Case Category</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} style={{ padding: 0 }}>
                <EmptyState
                  icon={FileText}
                  title="No FIR records available"
                  description="No statutory FIRs are synchronized on this node. Connect the National CCTNS / State Police ICJS interface to pull registered crime records."
                  badgeText="Zero Records"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FirRecordsPage;
