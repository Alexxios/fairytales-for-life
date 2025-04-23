import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home'
import { MediaLibrary } from './pages/MediaLibrary'
import { Page2 } from './pages/Page2'
import { Feedback } from './pages/Feedback'
import { FileUploader } from './pages/Admin';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/media" element={<MediaLibrary />} />
            <Route path="/gallery" element={null} />
            <Route path="/manage" element={<FileUploader />} />
            <Route path="/map" element={<Page2 />} />
            <Route path="/about" element={null} />
            <Route path="/feedback" element={<Feedback />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;