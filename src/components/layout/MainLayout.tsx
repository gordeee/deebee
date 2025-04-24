import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
  toggleMobileMenu: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, toggleMobileMenu }) => {
  return (
    <main className="flex-1 flex flex-col min-h-screen">
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full h-full">
          {children}
        </div>
      </div>
    </main>
  );
};

export default MainLayout;