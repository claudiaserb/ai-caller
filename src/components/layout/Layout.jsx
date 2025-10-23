import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, title }) => {
  return (
    <div className="min-h-screen dark:bg-dark-bg bg-light-bg">
      <Sidebar />
      <div className="ml-64">
        <Header title={title} />
        <main className="pt-16 min-h-screen overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;