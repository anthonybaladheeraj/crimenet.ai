import React, { useState } from 'react';
import {
  Share2,
  Cpu,
  Layers,
  Sparkles,
  ShieldAlert,
  GitFork,
  Radio,
  Download,
  Info
} from 'lucide-react';
import NetworkCanvasPlaceholder from '../../components/network/NetworkCanvasPlaceholder';
import Modal from '../../components/common/Modal';

const NetworkAnalysisPage = () => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

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
              Criminal Network Analysis
            </h2>
            <span className="badge badge-blue">Graph AI Engine</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            Multi-layered topological graph mapping connections between suspects, corporate conduits, and criminal syndicates
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setIsExportModalOpen(true)}
          >
            <Download size={15} />
            Export Graph Canvas
          </button>
        </div>
      </div>

      {/* Primary Network Canvas */}
      <NetworkCanvasPlaceholder />

      {/* Intelligence Metric Cards & Graph Parameters */}
      <div className="grid-3">
        {/* Node Topology */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: 'rgba(0, 180, 216, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)'
            }}>
              <GitFork size={16} />
            </div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Graph Centrality & Hubs</h4>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.45, marginBottom: '0.75rem' }}>
            Calculates Betweenness and PageRank centrality to identify criminal kingpins, logistics middlemen, and communication funnels.
          </p>
          <div style={{
            padding: '0.5rem',
            backgroundColor: 'rgba(8, 17, 45, 0.5)',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: 'var(--color-text-dim)',
            fontStyle: 'italic'
          }}>
            No graph nodes computed
          </div>
        </div>

        {/* AI Link Prediction */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: 'rgba(224, 169, 109, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-accent-gold)'
            }}>
              <Sparkles size={16} />
            </div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>AI Link Prediction</h4>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.45, marginBottom: '0.75rem' }}>
            Uses graph neural embeddings to forecast hidden links between front organizations, unregistered SIMs, and offshore bank accounts.
          </p>
          <div style={{
            padding: '0.5rem',
            backgroundColor: 'rgba(8, 17, 45, 0.5)',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: 'var(--color-text-dim)',
            fontStyle: 'italic'
          }}>
            No predictive links computed
          </div>
        </div>

        {/* Temporal Cluster Analysis */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-accent-success)'
            }}>
              <Layers size={16} />
            </div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Temporal Subgraph Slicing</h4>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.45, marginBottom: '0.75rem' }}>
            Reconstruct chronological evolution of the syndicate network prior to, during, and following major criminal operations.
          </p>
          <div style={{
            padding: '0.5rem',
            backgroundColor: 'rgba(8, 17, 45, 0.5)',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: 'var(--color-text-dim)',
            fontStyle: 'italic'
          }}>
            No temporal events indexed
          </div>
        </div>
      </div>

      {/* Export Modal Prototype */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Network Visualization"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            Authorized graph snapshots can be exported into court-admissible forensic formats once nodes are rendered:
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            backgroundColor: 'rgba(8, 17, 45, 0.6)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            fontSize: '0.8125rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-primary)' }}>
              <span>High-Resolution Vector (SVG/PDF):</span>
              <span className="badge badge-gray">Awaiting Nodes</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-primary)' }}>
              <span>Gephi Graph Exchange XML (GEXF):</span>
              <span className="badge badge-gray">Awaiting Nodes</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-primary)' }}>
              <span>Neo4j Cypher Relationship Dump:</span>
              <span className="badge badge-gray">Awaiting Nodes</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsExportModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NetworkAnalysisPage;
