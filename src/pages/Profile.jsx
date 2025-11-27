import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useShop } from '../contexts/ShopContext';
import { supabase } from '../lib/supabase';
import { User, Building2, Mail, Phone, MapPin, ChevronDown, CreditCard, Lock, FileText, Eye, EyeOff, Bell, BellOff, Store, Trash2, Plus, X, AlertTriangle } from 'lucide-react';
import Layout from '../components/layout/Layout';

const Profile = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { refreshShops } = useShop();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Get active tab from URL - read directly from searchParams (no useState)
  // This will reactively update when the URL changes
  const activeTab = searchParams.get('tab') || 'general';
  
  // Debug logging
  console.log('Profile rendered, activeTab:', activeTab, 'URL:', window.location.href);

  // General States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Business Info States
  const [companyName, setCompanyName] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [address, setAddress] = useState('');
  const [showBusinessTypeDropdown, setShowBusinessTypeDropdown] = useState(false);

  // Subscription States
  const [currentPlan, setCurrentPlan] = useState('free');
  const [ordersProcessed, setOrdersProcessed] = useState(0);
  const [minutesUsed, setMinutesUsed] = useState(0);

  // Security Tab States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Stores States
  const [stores, setStores] = useState([]);
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState(null);
  const [shopifyDomain, setShopifyDomain] = useState('');
  const [deleting, setDeleting] = useState(false);

  const translations = {
    EN: {
      pageTitle: 'Profile',
      general: 'General',
      subscription: 'Subscription',
      security: 'Security',
      stores: 'Stores',
      personalInfo: 'Personal Information',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone Number',
      businessInfo: 'Business Information',
      businessInfoDesc: 'Optional - Complete if you represent a business',
      companyName: 'Company Name',
      vatNumber: 'VAT Number (CUI/CIF)',
      regNumber: 'Registration Number',
      businessType: 'Business Type',
      address: 'Address',
      selectType: 'Select type',
      srl: 'SRL',
      pfa: 'PFA',
      pfi: 'PFI',
      sa: 'SA',
      other: 'Other',
      saveChanges: 'Save Changes',
      changesSaved: 'Changes saved successfully!',
      changesError: 'Failed to save changes',
      // Subscription Tab
      currentPlan: 'Current Plan',
      usageStats: 'Usage Statistics',
      thisMonth: 'This Month',
      ordersProcessed: 'Orders Processed',
      minutesUsed: 'Call Minutes Used',
      billingInfo: 'Billing Information',
      noPaymentMethod: 'No payment method added',
      addPaymentMethod: 'Add Payment Method',
      upgradePlan: 'Upgrade Plan',
      manageBilling: 'Manage Billing',
      free: 'Free',
      pro: 'Pro',
      premium: 'Premium',
      // Security Tab
      changePassword: 'Change Password',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm New Password',
      updatePassword: 'Update Password',
      emailNotifications: 'Email Notifications',
      notificationsEnabled: 'Enabled',
      notificationsDisabled: 'Disabled',
      notificationsDesc: 'Receive email notifications for important updates',
      passwordUpdated: 'Password updated successfully!',
      passwordError: 'Failed to update password',
      passwordMismatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 6 characters',
      // Stores Tab
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
      pageTitle: 'Profil',
      general: 'General',
      subscription: 'Abonament',
      security: 'Securitate',
      stores: 'Magazine',
      personalInfo: 'Informații Personale',
      firstName: 'Prenume',
      lastName: 'Nume',
      email: 'Email',
      phone: 'Număr Telefon',
      businessInfo: 'Informații Business',
      businessInfoDesc: 'Opțional - Completează dacă reprezinți un business',
      companyName: 'Nume Companie',
      vatNumber: 'CUI/CIF',
      regNumber: 'Nr. Reg. Com.',
      businessType: 'Tip Business',
      address: 'Adresă',
      selectType: 'Selectează tip',
      srl: 'SRL',
      pfa: 'PFA',
      pfi: 'PFI',
      sa: 'SA',
      other: 'Altul',
      saveChanges: 'Salvează Modificările',
      changesSaved: 'Modificările au fost salvate!',
      changesError: 'Eroare la salvarea modificărilor',
      // Subscription Tab
      currentPlan: 'Plan Curent',
      usageStats: 'Statistici Utilizare',
      thisMonth: 'Luna Aceasta',
      ordersProcessed: 'Comenzi Procesate',
      minutesUsed: 'Minute Apeluri',
      billingInfo: 'Informații Facturare',
      noPaymentMethod: 'Nicio metodă de plată adăugată',
      addPaymentMethod: 'Adaugă Metodă Plată',
      upgradePlan: 'Upgrade Plan',
      manageBilling: 'Gestionează Facturare',
      free: 'Gratuit',
      pro: 'Pro',
      premium: 'Premium',
      // Security Tab
      changePassword: 'Schimbă Parola',
      currentPassword: 'Parola Curentă',
      newPassword: 'Parola Nouă',
      confirmPassword: 'Confirmă Parola Nouă',
      updatePassword: 'Actualizează Parola',
      emailNotifications: 'Notificări Email',
      notificationsEnabled: 'Activate',
      notificationsDisabled: 'Dezactivate',
      notificationsDesc: 'Primește notificări email pentru actualizări importante',
      passwordUpdated: 'Parola a fost actualizată!',
      passwordError: 'Eroare la actualizarea parolei',
      passwordMismatch: 'Parolele nu se potrivesc',
      passwordTooShort: 'Parola trebuie să aibă minim 6 caractere',
      // Stores Tab
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

  const businessTypes = [
    { value: 'srl', label: t.srl },
    { value: 'pfa', label: t.pfa },
    { value: 'pfi', label: t.pfi },
    { value: 'sa', label: t.sa },
    { value: 'other', label: t.other },
  ];

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get current authenticated user
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !authUser) {
          console.error('Authentication error:', authError);
          setLoading(false);
          return;
        }

        // Load user profile from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('name, email, phone, company_name, vat_number, reg_number, business_type, address')
          .eq('user_id', authUser.id)
          .limit(1);

        if (profileError) {
          console.error('Error loading profile:', profileError);
          setLoading(false);
          return;
        }

        const profile = profileData?.[0];

        if (profile) {
          // Split name into first and last name
          const nameParts = profile.name?.split(' ') || ['', ''];
          setFirstName(nameParts[0] || '');
          setLastName(nameParts.slice(1).join(' ') || '');
          setEmail(profile.email || '');
          setPhone(profile.phone || '');
          // Load business information
          setCompanyName(profile.company_name || '');
          setVatNumber(profile.vat_number || '');
          setRegNumber(profile.reg_number || '');
          setBusinessType(profile.business_type || '');
          setAddress(profile.address || '');
        } else {
          setEmail(authUser.email || '');
        }

        // Load subscription
        const { data: subData, error: subError } = await supabase
          .from('subscriptions')
          .select('plan')
          .eq('user_id', authUser.id)
          .limit(1);

        if (subData?.[0]) {
          setCurrentPlan(subData[0].plan);
        }

        // Load usage stats
        const currentMonth = new Date().toISOString().slice(0, 7) + '-01';
        const { data: usageData, error: usageError } = await supabase
          .from('usage_stats')
          .select('orders_processed, minutes_used')
          .eq('user_id', authUser.id)
          .eq('month', currentMonth)
          .limit(1);

        if (usageData?.[0]) {
          setOrdersProcessed(usageData[0].orders_processed || 0);
          setMinutesUsed(usageData[0].minutes_used || 0);
        }

      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadUserData();
    }
  }, [user]);

  // Load stores
  useEffect(() => {
    const loadStores = async () => {
      if (!user) return;

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
      }
    };

    if (user && activeTab === 'stores') {
      loadStores();
    }
  }, [user, activeTab]);

  const handleSaveGeneral = async () => {
    // Validation
    if (!firstName.trim() || firstName.trim().length < 2) {
      setMessage(language === 'EN' ? 'First name must be at least 2 characters' : 'Prenumele trebuie să aibă minim 2 caractere');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    if (!lastName.trim() || lastName.trim().length < 2) {
      setMessage(language === 'EN' ? 'Last name must be at least 2 characters' : 'Numele trebuie să aibă minim 2 caractere');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    if (!email.trim()) {
      setMessage(language === 'EN' ? 'Email is required' : 'Email-ul este obligatoriu');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setMessage(language === 'EN' ? 'Please enter a valid email address' : 'Vă rugăm să introduceți o adresă de email validă');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Phone format validation (if provided)
    if (phone.trim()) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
      if (!phoneRegex.test(phone.trim())) {
        setMessage(language === 'EN' ? 'Please enter a valid phone number' : 'Vă rugăm să introduceți un număr de telefon valid');
        setTimeout(() => setMessage(''), 3000);
        return;
      }
    }

    setSaving(true);
    setMessage('');

    try {
      // Get authenticated user
      const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !authUser) {
        throw new Error('User not authenticated');
      }

      // Prepare data for UPDATE
      const updateData = {
        name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        company_name: companyName.trim() || null,
        vat_number: vatNumber.trim() || null,
        reg_number: regNumber.trim() || null,
        business_type: businessType.trim() || null,
        address: address.trim() || null,
        updated_at: new Date().toISOString()
      };

      // UPDATE profile
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', authUser.id);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Success message
      setMessage(language === 'EN' ? 'Profile updated successfully!' : 'Profil actualizat cu succes!');
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage(language === 'EN' ? `Failed to update profile: ${error.message}` : `Eroare la actualizarea profilului: ${error.message}`);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage(t.passwordMismatch);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    if (newPassword.length < 6) {
      setMessage(t.passwordTooShort);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setMessage(t.passwordUpdated);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage(t.passwordError);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

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

      // Refresh shops in ShopContext to update Header dropdown
      await refreshShops();

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
            {/* GENERAL TAB */}
            {activeTab === 'general' && (
              <div className="space-y-8">
                {/* Personal Info */}
                <div>
                  <h3 className="text-xl font-bold dark:text-dark-text text-light-text mb-6 flex items-center gap-2">
                    <User size={20} />
                    {t.personalInfo}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium dark:text-dark-muted text-light-muted mb-2">
                        {t.firstName}
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-gray-200/50 dark:text-dark-text text-light-text focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium dark:text-dark-muted text-light-muted mb-2">
                        {t.lastName}
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-gray-200/50 dark:text-dark-text text-light-text focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium dark:text-dark-muted text-light-muted mb-2">
                        {t.email}
                      </label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-dark-muted text-light-muted" />
                        <input
                          type="email"
                          value={email}
                          disabled
                          className="w-full pl-11 pr-4 py-3 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-gray-200/50 dark:text-dark-muted text-light-muted cursor-not-allowed"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium dark:text-dark-muted text-light-muted mb-2">
                        {t.phone}
                      </label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-dark-muted text-light-muted" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-gray-200/50 dark:text-dark-text text-light-text focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Info */}
                <div className="pt-6 border-t dark:border-white/10 border-gray-200/50">
                  <h3 className="text-xl font-bold dark:text-dark-text text-light-text mb-2 flex items-center gap-2">
                    <Building2 size={20} />
                    {t.businessInfo}
                  </h3>
                  <p className="text-sm dark:text-dark-muted text-light-muted mb-6">{t.businessInfoDesc}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium dark:text-dark-muted text-light-muted mb-2">
                        {t.companyName}
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-gray-200/50 dark:text-dark-text text-light-text focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium dark:text-dark-muted text-light-muted mb-2">
                        {t.vatNumber}
                      </label>
                      <input
                        type="text"
                        value={vatNumber}
                        onChange={(e) => setVatNumber(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-gray-200/50 dark:text-dark-text text-light-text focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium dark:text-dark-muted text-light-muted mb-2">
                        {t.regNumber}
                      </label>
                      <input
                        type="text"
                        value={regNumber}
                        onChange={(e) => setRegNumber(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-gray-200/50 dark:text-dark-text text-light-text focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium dark:text-dark-muted text-light-muted mb-2">
                        {t.businessType}
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowBusinessTypeDropdown(!showBusinessTypeDropdown)}
                          className="w-full px-4 py-3 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-gray-200/50 dark:text-dark-text text-light-text focus:outline-none focus:ring-2 focus:ring-accent-primary transition text-left flex items-center justify-between z-[20]"
                        >
                          <span className={businessType ? '' : 'dark:text-dark-muted text-light-muted'}>
                            {businessType ? businessTypes.find(type => type.value === businessType)?.label : t.selectType}
                          </span>
                          <ChevronDown size={18} className={`transition-transform ${showBusinessTypeDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showBusinessTypeDropdown && (
                          <>
                            <div
                              className="fixed inset-0 z-[25]"
                              onClick={() => setShowBusinessTypeDropdown(false)}
                            />
                            <div className="absolute top-full left-0 right-0 mt-2 dark:bg-dark-surface bg-white rounded-xl shadow-xl border dark:border-white/10 border-gray-200/50 overflow-hidden z-[30]">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setBusinessType('');
                                  setShowBusinessTypeDropdown(false);
                                }}
                                className="w-full px-4 py-3 text-left dark:hover:bg-white/5 hover:bg-black/5 transition dark:text-dark-muted text-light-muted text-sm"
                              >
                                {t.selectType}
                              </button>
                              {businessTypes.map((type) => (
                                <button
                                  key={type.value}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setBusinessType(type.value);
                                    setShowBusinessTypeDropdown(false);
                                  }}
                                  className={`w-full px-4 py-3 text-left transition text-sm ${
                                    businessType === type.value
                                      ? 'dark:bg-white/10 bg-black/5 text-accent-primary font-medium'
                                      : 'dark:hover:bg-white/5 hover:bg-black/5 dark:text-dark-text text-light-text'
                                  }`}
                                >
                                  {type.label}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium dark:text-dark-muted text-light-muted mb-2">
                        {t.address}
                      </label>
                      <div className="relative">
                        <MapPin size={18} className="absolute left-3 top-3 dark:text-dark-muted text-light-muted" />
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-gray-200/50 dark:text-dark-text text-light-text focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  type="button"
                  onClick={handleSaveGeneral}
                  disabled={saving}
                  className="w-full py-4 text-lg rounded-xl gradient-accent text-white font-semibold hover:opacity-90 transition shadow-lg shadow-teal-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving && (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {saving ? (language === 'EN' ? 'Saving...' : 'Se salvează...') : t.saveChanges}
                </button>
              </div>
            )}

            {/* SUBSCRIPTION TAB */}
            {activeTab === 'subscription' && (
              <div className="space-y-8">
                {/* Current Plan */}
                <div>
                  <h3 className="text-xl font-bold dark:text-dark-text text-light-text mb-6 flex items-center gap-2">
                    <CreditCard size={20} />
                    {t.currentPlan}
                  </h3>
                  <div className="p-6 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-gray-200/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold dark:text-dark-text text-light-text capitalize">
                          {t[currentPlan]}
                        </div>
                        <div className="text-sm dark:text-dark-muted text-light-muted mt-1">
                          {currentPlan === 'free' ? 'Basic features' : 'Advanced features'}
                        </div>
                      </div>
                      {currentPlan === 'free' && (
                        <button
                          type="button"
                          className="px-6 py-3 rounded-xl gradient-accent text-white font-semibold hover:opacity-90 transition shadow-lg"
                        >
                          {t.upgradePlan}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Usage Stats */}
                <div>
                  <h3 className="text-xl font-bold dark:text-dark-text text-light-text mb-6 flex items-center gap-2">
                    <FileText size={20} />
                    {t.usageStats}
                    <span className="text-sm font-normal dark:text-dark-muted text-light-muted ml-2">
                      ({t.thisMonth})
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-gray-200/50">
                      <div className="text-sm dark:text-dark-muted text-light-muted mb-2">{t.ordersProcessed}</div>
                      <div className="text-4xl font-bold dark:text-dark-text text-light-text">
                        {ordersProcessed}
                      </div>
                    </div>
                    <div className="p-6 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-gray-200/50">
                      <div className="text-sm dark:text-dark-muted text-light-muted mb-2">{t.minutesUsed}</div>
                      <div className="text-4xl font-bold dark:text-dark-text text-light-text">
                        {minutesUsed}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Billing Info */}
                <div>
                  <h3 className="text-xl font-bold dark:text-dark-text text-light-text mb-6">
                    {t.billingInfo}
                  </h3>
                  <div className="p-6 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-gray-200/50 text-center">
                    <p className="dark:text-dark-muted text-light-muted mb-4">{t.noPaymentMethod}</p>
                    <button
                      type="button"
                      className="px-6 py-3 rounded-xl dark:bg-white/10 bg-black/10 dark:hover:bg-white/20 hover:bg-black/20 dark:text-dark-text text-light-text font-medium transition"
                    >
                      {t.addPaymentMethod}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                {/* Change Password */}
                <div>
                  <h3 className="text-xl font-bold dark:text-dark-text text-light-text mb-6 flex items-center gap-2">
                    <Lock size={20} />
                    {t.changePassword}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium dark:text-dark-muted text-light-muted mb-2">
                        {t.currentPassword}
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-4 py-3 pr-12 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-gray-200/50 dark:text-dark-text text-light-text focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg dark:hover:bg-white/10 hover:bg-black/10 transition"
                        >
                          {showCurrentPassword ? (
                            <EyeOff size={18} className="dark:text-dark-muted text-light-muted" />
                          ) : (
                            <Eye size={18} className="dark:text-dark-muted text-light-muted" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium dark:text-dark-muted text-light-muted mb-2">
                        {t.newPassword}
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-3 pr-12 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-gray-200/50 dark:text-dark-text text-light-text focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg dark:hover:bg-white/10 hover:bg-black/10 transition"
                        >
                          {showNewPassword ? (
                            <EyeOff size={18} className="dark:text-dark-muted text-light-muted" />
                          ) : (
                            <Eye size={18} className="dark:text-dark-muted text-light-muted" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium dark:text-dark-muted text-light-muted mb-2">
                        {t.confirmPassword}
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-3 pr-12 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-gray-200/50 dark:text-dark-text text-light-text focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg dark:hover:bg-white/10 hover:bg-black/10 transition"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={18} className="dark:text-dark-muted text-light-muted" />
                          ) : (
                            <Eye size={18} className="dark:text-dark-muted text-light-muted" />
                          )}
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleChangePassword}
                      disabled={saving}
                      className="w-full py-4 text-lg rounded-xl gradient-accent text-white font-semibold hover:opacity-90 transition shadow-lg shadow-teal-600/20 disabled:opacity-50"
                    >
                      {saving ? 'Updating...' : t.updatePassword}
                    </button>
                  </div>
                </div>

                {/* Email Notifications */}
                <div className="pt-6 border-t dark:border-white/10 border-gray-200/50">
                  <h3 className="text-xl font-bold dark:text-dark-text text-light-text mb-2 flex items-center gap-2">
                    {emailNotifications ? <Bell size={20} /> : <BellOff size={20} />}
                    {t.emailNotifications}
                  </h3>
                  <p className="text-sm dark:text-dark-muted text-light-muted mb-6">{t.notificationsDesc}</p>
                  <div className="flex items-center justify-between p-6 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-gray-200/50">
                    <div>
                      <div className="font-semibold dark:text-dark-text text-light-text mb-1">
                        {emailNotifications ? t.notificationsEnabled : t.notificationsDisabled}
                      </div>
                      <div className="text-sm dark:text-dark-muted text-light-muted">
                        {emailNotifications ? 'You will receive email updates' : 'You will not receive email updates'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEmailNotifications(!emailNotifications)}
                      className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
                        emailNotifications ? 'bg-accent-primary' : 'dark:bg-gray-700 bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                          emailNotifications ? 'translate-x-8' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STORES TAB */}
            {activeTab === 'stores' && (
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
            )}
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

export default Profile;
