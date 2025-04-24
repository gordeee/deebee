import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Database } from 'lucide-react';
import Logo from '../ui/Logo';
import SignInButton from '../auth/SignInButton';
import UserMenu from '../auth/UserMenu';
import AnalysisHistory from '../analysis/AnalysisHistory';
import { useAuth } from '../../context/AuthContext';
import { DatabaseModal } from '../monitoring/DatabaseModal';

interface SidebarProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileMenuOpen, toggleMobileMenu }) => {
  const { user } = useAuth();

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-gray-200 md:hidden"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      {/* Mobile sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-40 bg-gray-900/80 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobileMenu}
          >
            <motion.div 
              className="fixed inset-y-0 left-0 w-64 bg-gray-900 p-4"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarContent />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-gray-900 p-4 border-r border-gray-800">
        <SidebarContent />
      </div>
    </>
  );
};

const SidebarContent = () => {
  const { user } = useAuth();
  const [showDatabaseModal, setShowDatabaseModal] = useState(false);

  const handleConnect = (connectionDetails: any) => {
    console.log('Connecting to database:', connectionDetails);
    setShowDatabaseModal(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center py-6">
        <Logo />
      </div>
      
      <nav className="mt-8 flex-1">
        {user && (
          <button
            onClick={() => setShowDatabaseModal(true)}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-md mb-4"
          >
            <Database size={16} />
            Sign in to monitor databases
          </button>
        )}
        <AnalysisHistory />
      </nav>
      
      <div className="mt-auto pt-4 border-t border-gray-800">
        {user ? <UserMenu /> : <SignInButton />}
        <div className="text-xs text-gray-500 mt-4">DeeBee v0.1.0</div>
      </div>

      <DatabaseModal 
        isOpen={showDatabaseModal}
        onClose={() => setShowDatabaseModal(false)}
        onConnect={handleConnect}
      />
    </div>
  );
};

export default Sidebar;