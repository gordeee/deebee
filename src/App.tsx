import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SharedAnalysis from './pages/SharedAnalysis';
import { AnalysisProvider } from './context/AnalysisContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AnalysisProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/share/:shareId" element={<SharedAnalysis />} />
          </Routes>
        </AnalysisProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;