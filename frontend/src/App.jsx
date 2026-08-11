/**
 * App.jsx
 * ──────────────────────────────────────────────────────────────────
 * Application root — client-side routing for Landing, Auth, and Dashboard.
 * ──────────────────────────────────────────────────────────────────
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing/index';
import AuthPage from './pages/auth/register';
import DashboardPage from './pages/dashboard/index';
import CheckinPage from './pages/checkin/index';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"          element={<LandingPage />} />
        <Route path="/auth"      element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/checkin"   element={<CheckinPage />} />
        <Route path="*"          element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
