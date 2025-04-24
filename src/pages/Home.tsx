import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import MainLayout from '../components/layout/MainLayout';
import SchemaPanel from '../components/schema/SchemaPanel';
import AnalysisPanel from '../components/analysis/AnalysisPanel';

function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-200 font-inter">
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        toggleMobileMenu={toggleMobileMenu} 
      />
      <MainLayout toggleMobileMenu={toggleMobileMenu}>
        <SchemaPanel />
        <AnalysisPanel />
      </MainLayout>
    </div>
  );
}

export default Home;