import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { MediaLibrary } from './pages/MediaLibrary'
import { Page2 } from './pages/Page2'
import { Page3 } from './pages/Page3'
import { FileUploader } from './pages/Admin';
import { Layout } from './Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/page1' element={<MediaLibrary />} />
          <Route path='/page2' element={<FileUploader />} />
          <Route path='/page3' element={<Page3 />} />
        </Route>
        </Routes>
    </Router>
  )
};

export default App;