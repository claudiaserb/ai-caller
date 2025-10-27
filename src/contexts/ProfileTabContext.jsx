import { createContext, useContext, useState } from 'react';

const ProfileTabContext = createContext();

export const ProfileTabProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <ProfileTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </ProfileTabContext.Provider>
  );
};

export const useProfileTab = () => {
  const context = useContext(ProfileTabContext);
  if (!context) {
    throw new Error('useProfileTab must be used within ProfileTabProvider');
  }
  return context;
};
