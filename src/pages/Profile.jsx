import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Building2, CreditCard, Lock, Mail, Phone, MapPin, FileText, Eye, EyeOff, Bell, BellOff, ChevronDown } from 'lucide-react';
import Layout from '../components/layout/Layout';

const Profile = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // General Tab States
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

  // Security Tab States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Subscription States
  const [currentPlan, setCurrentPlan] = useState('free');
  const [ordersProcessed, setOrdersProcessed] = useState(0);
  const [minutesUsed, setMinutesUsed] = useState(0);

  const translations = {
    EN: {
      pageTitle: 'Profile',
      general: 'General',
      subscription: 'Subscription',
      security: 'Security',
      // General Tab
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
      // Messages
      saveChanges: 'Save Changes',
      changesSaved: 'Changes saved successfully!',
      changesError: 'Failed to save changes',
      passwordUpdated: 'Password updated successfully!',
      passwordError: 'Failed to update password',
      passwordMismatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 6 characters',
    },
    RO: {
      pageTitle: 'Profil',
      general: 'General',
      subscription: 'Abonament',
      security: 'Securitate',
      // General Tab
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
      // Messages
      saveChanges: 'Salvează Modificările',
      changesSaved: 'Modificările au fost salvate!',
      changesError: 'Eroare la salvarea modificărilor',
      passwordUpdated: 'Parola a fost actualizată!',
      passwordError: 'Eroare la actualizarea parolei',
      passwordMismatch: 'Parolele nu se potrivesc',
      passwordTooShort: 'Parola trebuie să aibă minim 6 caractere',
    },
  };

  const t = translations[language];

  const tabs = [
    { id: 'general', label: t.general, icon: User },
    { id: 'subscription', label: t.subscription, icon: CreditCard },
    { id: 'security', label: t.security, icon: Lock },
  ];

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
        // Load user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name, phone, email')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error loading profile:', profileError);
        }

        if (profileData) {
          setFirstName(profileData.first_name || '');
          setLastName(profileData.last_name || '');
          setEmail(profileData.email || user.email);
          setPhone(profileData.phone || '');
        } else {
          setEmail(user.email);
        }

        // Load business profile
        const { data: businessData, error: businessError } = await supabase
          .from('business_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (businessData) {
          setCompanyName(businessData.company_name || '');
          setVatNumber(businessData.vat_number || '');
          setRegNumber(businessData.reg_number || '');
          setBusinessType(businessData.business_type || '');
          setAddress(businessData.address || '');
        }

        // Load subscription
        const { data: subData, error: subError } = await supabase
          .from('subscriptions')
          .select('plan')
          .eq('user_id', user.id)
          .single();

        if (subData) {
          setCurrentPlan(subData.plan);
        }

        // Load usage stats
        const currentMonth = new Date().toISOString().slice(0, 7) + '-01';
        const { data: usageData, error: usageError } = await supabase
          .from('usage_stats')
          .select('orders_processed, minutes_used')
          .eq('user_id', user.id)
          .eq('month', currentMonth)
          .single();

        if (usageData) {
          setOrdersProcessed(usageData.orders_processed || 0);
          setMinutesUsed(usageData.minutes_used || 0);
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

  const handleSaveGeneral = async () => {
    setSaving(true);
    setMessage('');

    try {
      // Upsert user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          email: user.email,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });

      if (profileError) throw profileError;

      // Upsert business profile
      const { error: businessError } = await supabase
        .from('business_profiles')
        .upsert({
          user_id: user.id,
          company_name: companyName,
          vat_number: vatNumber,
          reg_number: regNumber,
          business_type: businessType,
          address: address,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (businessError) throw businessError;

      setMessage(t.changesSaved);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving data:', error);
      setMessage(t.changesError);
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
        {/* Tabs Navigation */}
        <div className="glass dark:glass glass-light rounded-2xl p-2 mb-6">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    isActive
                      ? 'bg-accent-primary text-white shadow-lg'
                      : 'dark:text-dark-muted text-light-muted dark:hover:text-dark-text hover:text-light-text dark:hover:bg-white/5 hover:bg-black/5'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.includes('success') || message.includes('salvat') || message.includes('actualizat')
              ? 'bg-success/10 border border-success/20 text-success'
              : 'bg-error/10 border border-error/20 text-error'
          }`}>
            <p className="text-center font-medium">{message}</p>
          </div>
        )}

        {/* Tab Content */}
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
                          {businessType ? businessTypes.find(t => t.value === businessType)?.label : t.selectType}
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
                className="w-full py-4 text-lg rounded-xl gradient-accent text-white font-semibold hover:opacity-90 transition shadow-lg shadow-accent-primary/20 disabled:opacity-50"
              >
                {saving ? 'Saving...' : t.saveChanges}
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
                    className="w-full py-4 text-lg rounded-xl gradient-accent text-white font-semibold hover:opacity-90 transition shadow-lg shadow-accent-primary/20 disabled:opacity-50"
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
        </div>
      </div>
    </Layout>
  );
};

export default Profile;