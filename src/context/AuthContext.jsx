import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('crimenet_auth') === 'true';
  });
  
  const [officerId, setOfficerId] = useState(() => {
    return sessionStorage.getItem('crimenet_officer_id') || '';
  });

  const [pendingOfficerId, setPendingOfficerId] = useState(() => {
    return sessionStorage.getItem('crimenet_pending_officer_id') || '';
  });

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Step 1: Officer Login submission
  const initiateLogin = (id) => {
    setPendingOfficerId(id);
    sessionStorage.setItem('crimenet_pending_officer_id', id);
  };

  // Step 2: OTP verification
  const completeOtpVerification = () => {
    const activeId = pendingOfficerId || 'OFF-84920';
    setIsAuthenticated(true);
    setOfficerId(activeId);
    sessionStorage.setItem('crimenet_auth', 'true');
    sessionStorage.setItem('crimenet_officer_id', activeId);
    sessionStorage.removeItem('crimenet_pending_officer_id');
  };

  // Step 3: Logout
  const logout = () => {
    setIsAuthenticated(false);
    setOfficerId('');
    setPendingOfficerId('');
    setIsLogoutModalOpen(false);
    sessionStorage.removeItem('crimenet_auth');
    sessionStorage.removeItem('crimenet_officer_id');
    sessionStorage.removeItem('crimenet_pending_officer_id');
  };

  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        officerId: officerId || 'OFF-84920',
        pendingOfficerId,
        initiateLogin,
        completeOtpVerification,
        logout,
        isLogoutModalOpen,
        openLogoutModal,
        closeLogoutModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
