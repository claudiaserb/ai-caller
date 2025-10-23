import { Home, Phone, CheckSquare, FileText, Package } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from '../../utils/cn';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();

  const translations = {
    EN: {
      home: 'Home',
      features: 'FEATURES',
      callsSettings: 'Calls Settings',
      ordersConfirmation: 'Orders Confirmation',
      draftsConfirmation: 'Drafts Confirmation',
      products: 'Products',
    },
    RO: {
      home: 'Acasă',
      features: 'FUNCȚIONALITĂȚI',
      callsSettings: 'Setări Apeluri',
      ordersConfirmation: 'Confirmare Comenzi',
      draftsConfirmation: 'Confirmare Draft-uri',
      products: 'Produse',
    },
  };

  const t = translations[language];

  const menuItems = [
    { id: 'home', label: t.home, icon: Home, path: '/', section: null },
    { id: 'section-features', label: t.features, isSection: true },
    { id: 'calls-settings', label: t.callsSettings, icon: Phone, path: '/calls-settings', section: 'features' },
    { id: 'orders-confirmation', label: t.ordersConfirmation, icon: CheckSquare, path: '/orders-confirmation', section: 'features' },
    { id: 'drafts-confirmation', label: t.draftsConfirmation, icon: FileText, path: '/drafts-confirmation', section: 'features' },
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
    </div>
  );
};

export default Sidebar;