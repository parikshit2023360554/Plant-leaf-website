import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import DetectionPage from './components/DetectionPage';
import DiseaseGuide from './components/DiseaseGuide';
import AnalysisHistory from './components/AnalysisHistory';

function App() {
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          setApiStatus('online');
        } else {
          setApiStatus('offline');
        }
      } catch (e) {
        setApiStatus('offline');
      }
    };
    checkHealth();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<DetectionPage />} />
              <Route path="/disease-guide" element={<DiseaseGuide />} />
              <Route path="/history" element={<AnalysisHistory />} />
            </Routes>
          </main>

          <footer className="footer">
            <p style={{ margin: '6px 0', fontSize: '0.9rem' }}>
              Backend API:
              {apiStatus === 'checking' && ' Checking...'}
              {apiStatus === 'online' && ' Online ✅'}
              {apiStatus === 'offline' && ' Offline ❌'}
            </p>
            <p>&copy; 2024 PlantCare AI. Helping gardeners keep their plants healthy.</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
