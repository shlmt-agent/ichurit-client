import React, { useEffect } from 'react';
import AppTour from './components/AppTour';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useTour } from './hooks/useTour';

// Mock components for demonstration purposes
const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h2 data-tour="dashboard-title">Dashboard Page</h2>
      <p data-tour="dashboard-content">This is the main dashboard area.</p>
      <button onClick={() => navigate('/profile')} data-tour="navigate-profile-from-dashboard">Go to Profile</button>
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h2 data-tour="profile-title">Profile Page</h2>
      <p data-tour="profile-content">User profile information will be displayed here.</p>
      <button onClick={() => navigate('/settings')} data-tour="navigate-settings-from-profile">Go to Settings</button>
    </div>
  );
};
const Settings = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h2 data-tour="settings-title">Settings Page</h2>
      <p data-tour="settings-content">Application settings can be configured here.</p>
      <button onClick={() => navigate('/')} data-tour="navigate-home-from-settings">Go to Dashboard</button>
    </div>
  );
};

const Navbar = ({ onShowTourClick }: { onShowTourClick: () => void }) => {
  return (
    <nav data-tour="navbar" style={{ background: '#333', padding: '10px', color: 'white', marginBottom: '20px' }}>
      <ul style={{ listStyle: 'none', display: 'flex', justifyContent: 'space-around', margin: 0, padding: 0 }}>
        <li data-tour="navbar-dashboard"><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link></li>
        <li data-tour="navbar-profile"><Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>Profile</Link></li>
        <li data-tour="navbar-settings"><Link to="/settings" style={{ color: 'white', textDecoration: 'none' }}>Settings</Link></li>
        <li><button onClick={onShowTourClick} style={{ background: 'dodgerblue', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Show Tour</button></li>
      </ul>
    </nav>
  );
};

/**
 * TourProviderWrapper is a component that initializes the `useTour` hook
 * and provides its state and functions to the `AppTour` component and other
 * parts of the application (like the Navbar button to start the tour).
 * It also handles the logic for auto-starting the tour for first-time users.
 * This wrapper ensures that `useTour` (which uses `useNavigate`) is called
 * within the context of a <Router>.
 */
const TourProviderWrapper = () => {
  const tourHook = useTour(); // Initialize the tour hook

  // useEffect to handle auto-starting the tour on first visit
  useEffect(() => {
    const tourViewed = localStorage.getItem('tourViewed');
    if (!tourViewed) {
      // Auto-start tour for first-time users after a short delay to ensure page loads
      setTimeout(() => {
        tourHook.startTour();
      }, 1000);
    }
  }, [tourHook.startTour]); // Add tourHook.startTour to dependency array

  return (
    <div>
      <Navbar onShowTourClick={() => tourHook.startTour()} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      {/* Pass all props from tourHook to AppTour */}
      <AppTour
        run={tourHook.run}
        steps={tourHook.steps}
        stepIndex={tourHook.stepIndex}
        handleJoyrideCallback={tourHook.handleJoyrideCallback}
        tourKey={tourHook.tourKey}
      />
    </div>
  );
};

function App() {
  return (
    <Router>
      <TourProviderWrapper />
    </Router>
  );
}

export default App;
