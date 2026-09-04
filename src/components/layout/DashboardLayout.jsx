import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import LegalNoticeFooter from '../common/LegalNoticeFooter';
import LogoutModal from '../common/LogoutModal';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--color-bg-primary)' }}>
      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div 
        className="main-layout-wrapper"
        style={{
          marginLeft: 'var(--sidebar-width)',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          minWidth: 0,
          transition: 'margin-left 0.25s ease'
        }}
      >
        <TopNavbar onOpenSidebar={() => setSidebarOpen(true)} />

        <main style={{
          flex: 1,
          padding: '2rem',
          maxWidth: '1600px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box'
        }}>
          <Outlet />
        </main>

        <LegalNoticeFooter />
      </div>

      {/* Logout confirmation dialog */}
      <LogoutModal />
    </div>
  );
};

export default DashboardLayout;
