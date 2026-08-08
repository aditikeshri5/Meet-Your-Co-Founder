/**
 * App.jsx
 * ──────────────────────────────────────────────────────────────────
 * Application root setting up client-side routing for Landing and Auth pages.
 * ──────────────────────────────────────────────────────────────────
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing/index';
import AuthPage from './pages/auth/register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
