import { User, Store, Plus, X, CheckCircle, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useShop } from '../../contexts/ShopContext';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';

const Header = ({ title }) => {
  const { language } = useLanguage();
  const { user, signOut } = useAuth();
  const { shops, selectedShop, selectShop, addShop } = useShop();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showShopMenu, setShowShopMenu] = useState(false);
  const [showShopifyModal, setShowShopifyModal] = useState(false);
  const [shopifyDomain, setShopifyDomain] = useState('');
  const [shopifySuccess, setShopifySuccess] = useState(false);

  const translations = {
    EN: {
      profile: 'Profile',
      logout: 'Logout',
      connectedShop: 'Connected Shop',
      addNewShop: 'Add New Shop',
      noShops: 'No shops connected',
      connectShopify: 'Connect Shopify',
      shopifyStoreDomain: 'Shopify Store Domain',
      shopifyStorePlaceholder: 'mystore.myshopify.com',
      connect: 'Connect',
      cancel: 'Cancel',
      shopifyConnected: 'Shopify store connected successfully!',
      enterValidDomain: 'Please enter a valid Shopify store domain',
      manageStores: 'Manage stores',
    },
    RO: {
      profile: 'Profil',
      logout: 'Deconectare',
      connectedShop: 'Magazin Conectat',
      addNewShop: 'Adaugă Magazin Nou',
      noShops: 'Niciun magazin conectat',
      connectShopify: 'Conectează Shopify',
      shopifyStoreDomain: 'Domeniu Magazin Shopify',
      shopifyStorePlaceholder: 'mystore.myshopify.com',
      connect: 'Conectează',
      cancel: 'Anulează',
      shopifyConnected: 'Magazinul Shopify a fost conectat cu succes!',
      enterValidDomain: 'Te rog introdu un domeniu valid de magazin Shopify',
      manageStores: 'Gestionează magazine',
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

  // Check for Shopify connection success in URL params
  useEffect(() => {
    if (searchParams.get('shopify') === 'connected') {
      setShopifySuccess(true);
      // Remove shopify param but preserve other query params (like tab=stores)
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('shopify');
      setSearchParams(newParams, { replace: true });
      // Hide success message after 5 seconds
      setTimeout(() => setShopifySuccess(false), 5000);
      
      // Refresh shops list - the ShopContext should automatically reload
      // but we can trigger a page reload or wait for the context to update
      window.location.reload();
    }
  }, [searchParams, setSearchParams]);

  const handleAddNewShop = () => {
    setShowShopMenu(false);
    setShowShopifyModal(true);
  };

  const handleShopifyConnect = () => {
    const shopDomain = shopifyDomain.trim();
    
    if (!shopDomain) {
      alert(t.enterValidDomain);
      return;
    }
    
    // Validate domain format
    if (!shopDomain.includes('.') || (!shopDomain.includes('.myshopify.com') && !shopDomain.includes('.'))) {
      alert(t.enterValidDomain);
      return;
    }
    
    if (!user?.id) {
      alert(language === 'RO' 
        ? 'Eroare: Utilizatorul nu este autentificat'
        : 'Error: User is not authenticated'
      );
      return;
    }
    
    // Redirect to Shopify OAuth with user_id
    window.location.href = `https://dlduttpqjmbzydvnojri.supabase.co/functions/v1/shopify-auth?shop=${encodeURIComponent(shopDomain)}&user_id=${user.id}`;
  };

  const handleCloseShopifyModal = () => {
    setShowShopifyModal(false);
    setShopifyDomain('');
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
        return 'text-teal-500';
      default:
        return 'text-accent-primary';
    }
  };

  return (
    <header className="h-16 border-b dark:border-white/10 border-gray-200/50 dark:bg-dark-surface bg-light-surface flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-[40]">
      <h1 className="text-2xl font-bold dark:text-dark-text text-light-text">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Shop Selector */}
        <div className="relative">
          {shops.length > 0 ? (
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
          ) : (
            <button
              onClick={handleAddNewShop}
              className="flex items-center gap-2 px-3 py-2 rounded-lg dark:bg-white/5 bg-black/5 dark:hover:bg-white/10 hover:bg-black/10 transition border dark:border-white/10 border-gray-200/50"
              title={t.addNewShop}
            >
              <Plus size={16} className="text-accent-primary" />
              <span className="text-xs font-medium text-accent-primary">
                {t.addNewShop}
              </span>
            </button>
          )}

          {showShopMenu && shops.length > 0 && (
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
                    onClick={() => {
                      setShowShopMenu(false);
                      navigate('/profile?tab=stores');
                    }}
                    className="w-full px-4 py-3 text-left dark:hover:bg-white/5 hover:bg-black/5 transition flex items-center gap-3 border-t dark:border-white/10 border-gray-200/50"
                  >
                    <Settings size={16} className="text-accent-primary" />
                    <span className="text-sm font-medium text-accent-primary">
                      {t.manageStores}
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>

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

      {/* Shopify Success Toast */}
      {shopifySuccess && (
        <div className="fixed top-20 right-6 z-[10002] animate-in slide-in-from-top-5">
          <div className="glass dark:glass glass-light p-4 rounded-xl bg-success/10 border border-success/20 shadow-lg">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-success flex-shrink-0" />
              <p className="text-success font-medium text-sm">{t.shopifyConnected}</p>
            </div>
          </div>
        </div>
      )}

      {/* Shopify Connect Modal */}
      {showShopifyModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10002]"
            onClick={handleCloseShopifyModal}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[10003] p-4">
            <div 
              className="dark:bg-dark-surface bg-light-surface rounded-2xl shadow-xl border dark:border-white/10 border-gray-200 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold dark:text-dark-text text-light-text">
                  {t.connectShopify}
                </h3>
                <button
                  onClick={handleCloseShopifyModal}
                  className="p-2 rounded-lg dark:hover:bg-white/10 hover:bg-black/10 transition"
                >
                  <X size={20} className="dark:text-dark-text text-light-text" />
                </button>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium dark:text-dark-text text-light-text mb-2">
                  {t.shopifyStoreDomain}
                </label>
                <input
                  type="text"
                  value={shopifyDomain}
                  onChange={(e) => setShopifyDomain(e.target.value)}
                  placeholder={t.shopifyStorePlaceholder}
                  className="w-full px-4 py-3 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-gray-200/50 dark:text-dark-text text-light-text placeholder:dark:text-dark-muted placeholder:text-light-muted focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleShopifyConnect();
                    }
                  }}
                  autoFocus
                />
                <p className="text-xs dark:text-dark-muted text-light-muted mt-2">
                  {language === 'RO' 
                    ? 'Exemplu: mystore.myshopify.com'
                    : 'Example: mystore.myshopify.com'}
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCloseShopifyModal}
                  className="flex-1 px-4 py-2.5 rounded-lg dark:bg-white/5 bg-black/5 dark:hover:bg-white/10 hover:bg-black/10 dark:text-dark-text text-light-text font-semibold transition"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleShopifyConnect}
                  className="flex-1 px-4 py-2.5 rounded-lg gradient-accent text-white font-semibold hover:opacity-90 transition"
                >
                  {t.connect}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;