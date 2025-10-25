import { User, Store, Plus } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useShop } from '../../contexts/ShopContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ title }) => {
  const { language } = useLanguage();
  const { user, signOut } = useAuth();
  const { shops, selectedShop, selectShop } = useShop();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showShopMenu, setShowShopMenu] = useState(false);

  const translations = {
    EN: {
      profile: 'Profile',
      logout: 'Logout',
      connectedShop: 'Connected Shop',
      addNewShop: 'Add New Shop',
      noShops: 'No shops connected',
    },
    RO: {
      profile: 'Profil',
      logout: 'Deconectare',
      connectedShop: 'Magazin Conectat',
      addNewShop: 'Adaugă Magazin Nou',
      noShops: 'Niciun magazin conectat',
    },
  };

  const t = translations[language];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleShopSelect = (shopId) => {
    selectShop(shopId);
    setShowShopMenu(false);
  };

  const handleAddNewShop = () => {
    setShowShopMenu(false);
    navigate('/add-shop');
  };

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const getPlatformColor = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'shopify':
        return 'text-green-500';
      case 'woocommerce':
        return 'text-purple-500';
      default:
        return 'text-accent-primary';
    }
  };

  return (
    <header className="h-16 border-b dark:border-white/10 border-gray-200/50 dark:bg-dark-surface bg-light-surface flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-[40]">
      <h1 className="text-2xl font-bold dark:text-dark-text text-light-text">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Shop Selector */}
        {shops.length > 0 && (
          <div className="relative">
            <button
              onClick={() => {
                setShowShopMenu(!showShopMenu);
                setShowUserMenu(false);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg dark:bg-white/5 bg-black/5 dark:hover:bg-white/10 hover:bg-black/10 transition border dark:border-white/10 border-gray-200/50"
              title={selectedShop?.name || t.noShops}
            >
              <Store size={16} className={selectedShop ? getPlatformColor(selectedShop.platform) : 'dark:text-dark-text text-light-text'} />
              <span className="text-xs font-medium dark:text-dark-text text-light-text max-w-[120px] truncate">
                {selectedShop?.name || t.noShops}
              </span>
              <svg
                className={`w-3 h-3 transition-transform dark:text-dark-muted text-light-muted ${
                  showShopMenu ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showShopMenu && (
              <>
                <div className="fixed inset-0 z-[10000]" onClick={() => setShowShopMenu(false)} />
                <div className="absolute top-full right-0 mt-2 w-64 dark:bg-dark-surface bg-white rounded-xl shadow-lg border dark:border-white/10 border-gray-200/50 overflow-hidden z-[10001]">
                  <div className="px-3 py-2 border-b dark:border-white/10 border-gray-200/50">
                    <span className="text-xs font-semibold dark:text-dark-muted text-light-muted uppercase tracking-wider">
                      {t.connectedShop}
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {shops.map((shop) => (
                      <button
                        key={shop.id}
                        onClick={() => handleShopSelect(shop.id)}
                        className={`w-full px-4 py-3 text-left transition flex items-center gap-3 ${
                          selectedShop?.id === shop.id
                            ? 'dark:bg-white/10 bg-black/5'
                            : 'dark:hover:bg-white/5 hover:bg-black/5'
                        }`}
                      >
                        <Store size={16} className={getPlatformColor(shop.platform)} />
                        <div className="flex-1">
                          <div className="text-sm font-medium dark:text-dark-text text-light-text">
                            {shop.name}
                          </div>
                          <div className="text-xs dark:text-dark-muted text-light-muted capitalize">
                            {shop.platform}
                          </div>
                        </div>
                        {selectedShop?.id === shop.id && (
                          <div className="w-2 h-2 rounded-full bg-accent-primary"></div>
                        )}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleAddNewShop}
                    className="w-full px-4 py-3 text-left dark:hover:bg-white/5 hover:bg-black/5 transition flex items-center gap-3 border-t dark:border-white/10 border-gray-200/50"
                  >
                    <Plus size={16} className="text-accent-primary" />
                    <span className="text-sm font-medium text-accent-primary">
                      {t.addNewShop}
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowShopMenu(false);
            }}
            className="p-1 rounded-xl dark:hover:bg-white/5 hover:bg-black/5 transition"
          >
            <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">{userInitials}</span>
            </div>
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-[10000]" onClick={() => setShowUserMenu(false)} />
              <div className="absolute top-full right-0 mt-2 w-56 dark:bg-dark-surface bg-white rounded-xl shadow-lg border dark:border-white/10 border-gray-200/50 overflow-hidden z-[10001]">
                <div className="px-4 py-3 border-b dark:border-white/10 border-gray-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">{userInitials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold dark:text-dark-text text-light-text truncate">
                        {userName}
                      </div>
                      <div className="text-xs dark:text-dark-muted text-light-muted truncate">
                        {userEmail}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/profile');
                    }}
                    className="w-full px-4 py-2.5 text-left dark:hover:bg-white/5 hover:bg-black/5 dark:text-dark-text text-light-text transition flex items-center gap-3"
                  >
                    <User size={16} />
                    <span className="text-sm">{t.profile}</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left dark:hover:bg-white/5 hover:bg-black/5 text-error transition flex items-center gap-3"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-sm">{t.logout}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;