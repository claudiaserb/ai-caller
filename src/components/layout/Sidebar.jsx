import { Home, Phone, CheckSquare, FileText, Package, Globe } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/cn';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const translations = {
    EN: {
      home: 'Home',
      features: 'FEATURES',
      callsSettings: 'Calls Settings',
      ordersConfirmation: 'Orders Confirmation',
      orders: 'Orders',
      products: 'Products',
    },
    RO: {
      home: 'Acasă',
      features: 'FUNCȚIONALITĂȚI',
      callsSettings: 'Setări Apeluri',
      ordersConfirmation: 'Confirmare Comenzi',
      orders: 'Comenzi',
      products: 'Produse',
    },
  };

  const t = translations[language];

  const menuItems = [
    { id: 'home', label: t.home, icon: Home, path: '/', section: null },
    { id: 'section-features', label: t.features, isSection: true },
    { id: 'calls-settings', label: t.callsSettings, icon: Phone, path: '/calls-settings', section: 'features' },
    { id: 'orders-confirmation', label: t.ordersConfirmation, icon: CheckSquare, path: '/orders-confirmation', section: 'features' },
    { id: 'orders', label: t.orders, icon: FileText, path: '/orders', section: 'features' },
    { id: 'products', label: t.products, icon: Package, path: '/products', section: null },
  ];

  return (
    <div className="w-64 h-screen fixed left-0 top-0 dark:bg-dark-surface bg-light-surface border-r dark:border-white/10 border-gray-200/50 flex flex-col">
      <div className="p-6 border-b dark:border-white/10 border-gray-200/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
            <span className="text-white font-bold text-lg">O</span>
          </div>
          <span className="font-bold text-xl dark:text-dark-text text-light-text">Ordify</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          if (item.isSection) {
            return (
              <div key={item.id} className="px-3 py-2 mt-4">
                <span className="text-xs font-semibold dark:text-dark-muted text-light-muted uppercase tracking-wider">
                  {item.label}
                </span>
              </div>
            );
          }

          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                isActive
                  ? "dark:bg-white/10 bg-black/5 text-accent-primary"
                  : "dark:text-dark-text text-light-text dark:hover:bg-white/5 hover:bg-black/5"
              )}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Settings Section - Compact */}
      <div className="p-4 border-t dark:border-white/10 border-gray-200/50">
        <div className="flex items-center justify-center gap-3">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="p-2.5 rounded-lg dark:hover:bg-white/5 hover:bg-black/5 transition dark:text-dark-text text-light-text"
            >
              <div className="flex items-center gap-1.5">
                <Globe size={16} />
                <span className="text-xs font-medium">{language}</span>
              </div>
            </button>

            {showLangMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowLangMenu(false)} />
                <div className="absolute bottom-full left-0 mb-2 w-32 dark:bg-dark-surface bg-white rounded-xl shadow-lg border dark:border-white/10 border-gray-200/50 overflow-hidden z-20">
                  <button
                    onClick={() => {
                      setLanguage('EN');
                      setShowLangMenu(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm transition ${
                      language === 'EN'
                        ? 'dark:bg-white/10 bg-black/5 text-accent-primary'
                        : 'dark:hover:bg-white/5 hover:bg-black/5 dark:text-dark-text text-light-text'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('RO');
                      setShowLangMenu(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm transition ${
                      language === 'RO'
                        ? 'dark:bg-white/10 bg-black/5 text-accent-primary'
                        : 'dark:hover:bg-white/5 hover:bg-black/5 dark:text-dark-text text-light-text'
                    }`}
                  >
                    Română
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Theme Toggle - Animated Switch */}
          <button
            onClick={toggleTheme}
            className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
              isDark ? 'bg-gray-800' : 'bg-gray-200'
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-300 ${
                isDark ? 'translate-x-8' : 'translate-x-0'
              }`}
            >
              {isDark ? (
                <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l1 1m-1 3l1 1" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="4" fill="currentColor" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
                </svg>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;