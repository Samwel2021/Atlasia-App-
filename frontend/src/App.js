import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import pages (to be created)
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminPortal from './pages/portals/AdminPortal';
import CustomerPortal from './pages/portals/CustomerPortal';
import TransporterPortal from './pages/portals/TransporterPortal';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
        <Route path="/admin/*" element={isAuthenticated && userRole === 'admin' ? <AdminPortal /> : <Navigate to="/login" />} />
        <Route path="/customer/*" element={isAuthenticated && userRole === 'customer' ? <CustomerPortal /> : <Navigate to="/login" />} />
        <Route path="/transporter/*" element={isAuthenticated && userRole === 'transporter' ? <TransporterPortal /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
