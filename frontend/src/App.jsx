import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';

import Home from './pages/Home'
import MediaLibrary from './pages/MediaLibrary'
import MapPage from './pages/MapPage'
import Feedback from './pages/Feedback'
import Admin from './pages/Admin';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/media" element={<MediaLibrary />} />
              <Route path="/gallery" element={null} />
              <Route path="/manage" element={<Admin />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/about" element={null} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/auth" element={<AuthPage />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;