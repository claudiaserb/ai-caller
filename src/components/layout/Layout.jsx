import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileTabProvider } from '../../contexts/ProfileTabContext';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, title }) => {
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem('sidebarCollapsed');
      setIsCollapsed(saved ? JSON.parse(saved) : false);
    };
    window.addEventListener('storage', handleStorage);
    // Check on interval as fallback
    const interval = setInterval(() => {
      const saved = localStorage.getItem('sidebarCollapsed');
      const newValue = saved ? JSON.parse(saved) : false;
      if (newValue !== isCollapsed) {
        setIsCollapsed(newValue);
      }
    }, 100);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, [isCollapsed]);

  const content = (
    <div className="min-h-screen dark:bg-dark-bg bg-light-bg">
      <Sidebar />
      <div className={`transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        <Header title={title} isCollapsed={isCollapsed} />
        <main className="pt-16 min-h-screen overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );

  // Wrap profile page with ProfileTabProvider
  return isProfilePage ? (
    <ProfileTabProvider>
      {content}
    </ProfileTabProvider>
  ) : content;
};

export default Layout;xport default Layout;