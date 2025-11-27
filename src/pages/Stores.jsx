import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Store, Trash2, Plus, X, AlertTriangle } from 'lucide-react';
import Layout from '../components/layout/Layout';

const Stores = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState(null);
  const [shopifyDomain, setShopifyDomain] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState('');

  const translations = {
    EN: {
      pageTitle: 'Stores',
      connectedStores: 'Connected Stores',
      addNewStore: 'Add New Store',
      storeName: 'Store Name',
      platform: 'Platform',
      storeUrl: 'Store URL',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      disconnect: 'Disconnect',
      disconnectConfirm: 'Are you sure you want to disconnect {store_name}? Existing orders will remain, but you will no longer receive new orders.',
      disconnectStore: 'Disconnect Store',
      cancel: 'Cancel',
      connectShopify: 'Connect Shopify',
      shopifyStoreDomain: 'Shopify Store Domain',
      shopifyStorePlaceholder: 'mystore.myshopify.com',
      connect: 'Connect',
      enterValidDomain: 'Please enter a valid Shopify store domain',
      noStores: 'No stores connected',
    },
    RO: {
      pageTitle: 'Magazine',
      connectedStores: 'Magazine Conectate',
      addNewStore: 'Adaugă Magazin Nou',
      storeName: 'Nume Magazin',
      platform: 'Platformă',
      storeUrl: 'URL Magazin',
      status: 'Status',
      active: 'Activ',
      inactive: 'Inactiv',
      disconnect: 'Deconectează',
      disconnectConfirm: 'Ești sigur că vrei să deconectezi {store_name}? Comenzile existente vor rămâne, dar nu vei mai primi comenzi noi.',
      disconnectStore: 'Deconectează Magazin',
      cancel: 'Anulează',
      connectShopify: 'Conectează Shopify',
      shopifyStoreDomain: 'Domeniu Magazin Shopify',
      shopifyStorePlaceholder: 'mystore.myshopify.com',
      connect: 'Conectează',
      enterValidDomain: 'Te rog introdu un domeniu valid de magazin Shopify',
      noStores: 'Niciun magazin conectat',
    },
  };

  const t = translations[language];

  // Load stores
  useEffect(() => {
    const loadStores = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('shops')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setStores(data || []);
      } catch (error) {
        console.error('Error loading stores:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadStores();
    }
  }, [user]);

  const handleAddStore = () => {
    setShowAddStoreModal(true);
  };

  const handleShopifyConnect = () => {
    const shopDomain = shopifyDomain.trim();
    
    if (!shopDomain) {
      setMessage(t.enterValidDomain);
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    // Validate domain format
    if (!shopDomain.includes('.') || (!shopDomain.includes('.myshopify.com') && !shopDomain.includes('.'))) {
      setMessage(t.enterValidDomain);
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    if (!user?.id) {
      setMessage(language === 'RO' 
        ? 'Eroare: Utilizatorul nu este autentificat'
        : 'Error: User is not authenticated'
      );
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    // Redirect to Shopify OAuth with user_id
    window.location.href = `https://dlduttpqjmbzydvnojri.supabase.co/functions/v1/shopify-auth?shop=${encodeURIComponent(shopDomain)}&user_id=${user.id}`;
  };

  const handleDeleteStore = async () => {
    if (!storeToDelete || !user) return;

    setDeleting(true);
    try {
      // Delete from shops table
      const { error: shopsError } = await supabase
        .from('shops')
        .delete()
        .eq('id', storeToDelete.id)
        .eq('user_id', user.id);

      if (shopsError) throw shopsError;

      // Delete from shopify_stores table if it exists
      if (storeToDelete.platform === 'Shopify' && storeToDelete.store_url) {
        const shopDomain = storeToDelete.store_url.replace('https://', '').replace('http://', '');
        const { error: shopifyError } = await supabase
          .from('shopify_stores')
          .delete()
          .eq('shop_domain', shopDomain)
          .eq('user_id', user.id);

        // Don't throw if shopify_stores doesn't exist
        if (shopifyError && shopifyError.code !== 'PGRST116') {
          console.error('Error deleting from shopify_stores:', shopifyError);
        }
      }

      // If deleted store was active, switch to another store
      if (storeToDelete.is_active) {
        const remainingStores = stores.filter(s => s.id !== storeToDelete.id);
        if (remainingStores.length > 0) {
          // Set first remaining store as active
          await supabase
            .from('shops')
            .update({ is_active: true })
            .eq('id', remainingStores[0].id)
            .eq('user_id', user.id);
        }
      }

      // Refresh stores list
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setStores(data || []);

      setMessage(language === 'RO' 
        ? 'Magazinul a fost deconectat cu succes!'
        : 'Store disconnected successfully!'
      );
      setTimeout(() => setMessage(''), 3000);

      setShowDeleteConfirmModal(false);
      setStoreToDelete(null);
    } catch (error) {
      console.error('Error deleting store:', error);
      setMessage(language === 'RO' 
        ? 'Eroare la deconectarea magazinului'
        : 'Error disconnecting store'
      );
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Layout title={t.pageTitle}>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="dark:text-dark-muted text-light-muted">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={t.pageTitle}>
      <div className="max-w-5xl mx-auto">
        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.includes('success') || message.includes('salvat') || message.includes('actualizat') || message.includes('deconectat')
              ? 'bg-success/10 border border-success/20 text-success'
              : 'bg-error/10 border border-error/20 text-error'
          }`}>
            <p className="text-center font-medium">{message}</p>
          </div>
        )}

        {/* Content */}
        <div className="glass dark:glass glass-light p-8 rounded-2xl">
          <div className="space-y-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold dark:text-dark-text text-light-text flex items-center gap-2">
                <Store size={20} />
                {t.connectedStores}
              </h3>
              <button
                onClick={handleAddStore}
                className="px-4 py-2 rounded-xl gradient-accent text-white font-semibold hover:opacity-90 transition shadow-lg shadow-teal-600/20 flex items-center gap-2"
              >
                <Plus size={18} />
                {t.addNewStore}
              </button>
            </div>

            {stores.length === 0 ? (
              <div className="text-center py-12">
                <Store size={48} className="mx-auto dark:text-dark-muted text-light-muted mb-4" />
                <p className="text-lg dark:text-dark-muted text-light-muted mb-4">{t.noStores}</p>
                <button
                  onClick={handleAddStore}
                  className="px-6 py-3 rounded-xl gradient-accent text-white font-semibold hover:opacity-90 transition shadow-lg shadow-teal-600/20 flex items-center gap-2 mx-auto"
                >
                  <Plus size={18} />
                  {t.addNewStore}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stores.map((store) => (
                  <div
                    key={store.id}
                    className="p-6 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-gray-200/50 hover:border-accent-primary/50 transition"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Store size={20} className={store.platform === 'Shopify' ? 'text-green-500' : 'text-accent-primary'} />
                          <h4 className="text-lg font-bold dark:text-dark-text text-light-text">
                            {store.name}
                          </h4>
                          {store.is_active && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
                              {t.active}
                            </span>
                          )}
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="dark:text-dark-muted text-light-muted">{t.platform}:</span>
                            <span className="dark:text-dark-text text-light-text capitalize font-medium">
                              {store.platform}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="dark:text-dark-muted text-light-muted">{t.storeUrl}:</span>
                            <a
                              href={store.store_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent-primary hover:underline truncate"
                            >
                              {store.store_url}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="dark:text-dark-muted text-light-muted">{t.status}:</span>
                            <span className={`font-medium ${
                              store.is_active 
                                ? 'text-success' 
                                : 'dark:text-dark-muted text-light-muted'
                            }`}>
                              {store.is_active ? t.active : t.inactive}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setStoreToDelete(store);
                          setShowDeleteConfirmModal(true);
                        }}
                        className="p-2 rounded-lg dark:hover:bg-error/10 hover:bg-error/10 text-error transition"
                        title={t.disconnect}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Store Modal */}
      {showAddStoreModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10002]"
            onClick={() => {
              setShowAddStoreModal(false);
              setShopifyDomain('');
            }}
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
                  onClick={() => {
                    setShowAddStoreModal(false);
                    setShopifyDomain('');
                  }}
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
                  onClick={() => {
                    setShowAddStoreModal(false);
                    setShopifyDomain('');
                  }}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && storeToDelete && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10002]"
            onClick={() => {
              setShowDeleteConfirmModal(false);
              setStoreToDelete(null);
            }}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[10003] p-4">
            <div 
              className="dark:bg-dark-surface bg-light-surface rounded-2xl shadow-xl border dark:border-white/10 border-gray-200 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
                  <AlertTriangle size={24} className="text-error" />
                </div>
                <div>
                  <h3 className="text-xl font-bold dark:text-dark-text text-light-text">
                    {t.disconnectStore}
                  </h3>
                </div>
              </div>
              
              <p className="dark:text-dark-text text-light-text mb-6">
                {t.disconnectConfirm.replace('{store_name}', storeToDelete.name)}
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirmModal(false);
                    setStoreToDelete(null);
                  }}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 rounded-lg dark:bg-white/5 bg-black/5 dark:hover:bg-white/10 hover:bg-black/10 dark:text-dark-text text-light-text font-semibold transition disabled:opacity-50"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleDeleteStore}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-error/10 hover:bg-error/20 text-error font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting && (
                    <div className="w-4 h-4 border-2 border-error border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {t.disconnect}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Stores;

