import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { MediaLibrary } from './pages/MediaLibrary'
import { Page2 } from './pages/Page2'
import { Feedback } from './pages/Feedback'
import { FileUploader } from './pages/Admin';
import { Layout } from './Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/page1' element={<MediaLibrary />} />
          <Route path='/page2' element={<Page2 />} />
          <Route path='/page3' element={<Feedback />} />
        </Route>
        </Routes>
    </Router>
  )
};

export default App;