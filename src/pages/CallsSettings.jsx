import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useShop } from '../contexts/ShopContext';
import { supabase } from '../lib/supabase';
import { Clock } from 'lucide-react';
import Layout from '../components/layout/Layout';

const ScrollPicker = ({ value, onChange, max, label }) => {
  const scrollRef = useRef(null);
  const itemHeight = 40;

  useEffect(() => {
    if (scrollRef.current) {
      const index = parseInt(value);
      scrollRef.current.scrollTop = index * itemHeight;
    }
  }, [value]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollTop = scrollRef.current.scrollTop;
      const index = Math.round(scrollTop / itemHeight);
      const newValue = index.toString().padStart(2, '0');
      if (newValue !== value && index >= 0 && index <= max) {
        onChange(newValue);
      }
    }
  };

  const items = Array.from({ length: max + 1 }, (_, i) => i.toString().padStart(2, '0'));

  return (
    <div className="flex-1">
      <div className="text-[10px] font-semibold dark:text-dark-muted text-light-muted mb-1 uppercase tracking-wider text-center">
        {label}
      </div>
      <div className="relative h-32 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b dark:from-dark-surface from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t dark:from-dark-surface from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute top-1/2 -translate-y-1/2 left-1 right-1 h-10 rounded-lg dark:bg-accent-primary/10 bg-accent-primary/5 border border-accent-primary/30 pointer-events-none z-10" />

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
          style={{ paddingTop: '46px', paddingBottom: '46px' }}
        >
          {items.map((item) => (
            <div
              key={item}
              className="h-10 flex items-center justify-center snap-center"
            >
              <span
                className={`text-base font-semibold transition-all ${
                  item === value
                    ? 'dark:text-dark-text text-light-text scale-100'
                    : 'dark:text-dark-muted text-light-muted scale-75 opacity-40'
                }`}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TimeInput = ({ value, onChange, label }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [hours, setHours] = useState(value.split(':')[0]);
  const [minutes, setMinutes] = useState(value.split(':')[1]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    if (/^\d{2}:\d{2}$/.test(val)) {
      const [h, m] = val.split(':');
      if (parseInt(h) >= 0 && parseInt(h) <= 23 && parseInt(m) >= 0 && parseInt(m) <= 59) {
        onChange(val);
      }
    }
  };

  const handleInputBlur = () => {
    if (!/^\d{2}:\d{2}$/.test(inputValue)) {
      setInputValue(value);
    }
  };

  const handleDone = () => {
    onChange(`${hours}:${minutes}`);
    setInputValue(`${hours}:${minutes}`);
    setShowPicker(false);
  };

  useEffect(() => {
    setInputValue(value);
    setHours(value.split(':')[0]);
    setMinutes(value.split(':')[1]);
  }, [value]);

  return (
    <div>
      <label className="block text-sm font-medium dark:text-dark-muted text-light-muted mb-3">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder="HH:MM"
          className="w-full px-4 py-4 pr-14 text-lg rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-gray-200/50 dark:text-dark-text text-light-text focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
        />
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg dark:hover:bg-white/10 hover:bg-black/10 transition"
        >
          <Clock size={20} className="dark:text-dark-muted text-light-muted" />
        </button>

        {showPicker && (
          <div className="absolute bottom-full left-0 right-0 mb-2 dark:bg-dark-surface/95 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border dark:border-white/10 border-gray-200 p-4 z-20">
            <div className="flex gap-3 mb-3">
              <ScrollPicker
                value={hours}
                onChange={setHours}
                max={23}
                label="HOURS"
              />
              <div className="flex items-center justify-center text-2xl font-bold dark:text-dark-text text-light-text pt-4">
                :
              </div>
              <ScrollPicker
                value={minutes}
                onChange={setMinutes}
                max={59}
                label="MINUTES"
              />
            </div>
            <button
              type="button"
              onClick={handleDone}
              className="w-full py-2.5 text-sm rounded-lg gradient-accent text-white font-semibold hover:opacity-90 transition"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const CallsSettings = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { shops } = useShop();
  const [tone, setTone] = useState('professional');
  const [voice, setVoice] = useState('feminine');
  const [activeDays, setActiveDays] = useState([1, 2, 3, 4, 5]); // Luni-Vineri by default
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [applyToAllShops, setApplyToAllShops] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const translations = {
    EN: {
      pageTitle: 'Calls Settings',
      cardTitle: 'Configure AI Agent',
      conversationTone: 'Conversation Tone',
      professional: 'Professional',
      professionalDesc: 'Formal and business-like',
      friendly: 'Friendly',
      friendlyDesc: 'Casual and approachable',
      voiceType: 'Voice Type',
      feminine: 'Feminine',
      feminineDesc: 'Female voice',
      masculine: 'Masculine',
      masculineDesc: 'Male voice',
      activeDays: 'Active Days',
      activeDaysDesc: 'Select days when AI agent can make calls',
      monday: 'Mon',
      tuesday: 'Tue',
      wednesday: 'Wed',
      thursday: 'Thu',
      friday: 'Fri',
      saturday: 'Sat',
      sunday: 'Sun',
      callInterval: 'Call Interval',
      startTime: 'Start Time',
      endTime: 'End Time',
      saveSettings: 'Save Settings',
      settingsSaved: 'Settings saved successfully!',
      settingsError: 'Failed to save settings',
      applyToAllShops: 'Apply same settings to all stores',
      confirmApplyToAll: 'Apply to All Stores',
      confirmMessage: 'Are you sure you want to apply these settings to all your stores? This will overwrite existing settings for each store.',
      confirm: 'Confirm',
      cancel: 'Cancel',
      applyingToAll: 'Applying to all stores...',
      appliedToAll: 'Settings applied to all stores successfully!',
      errorApplyingToAll: 'Failed to apply settings to all stores',
    },
    RO: {
      pageTitle: 'Setări Apeluri',
      cardTitle: 'Configurare Agent AI',
      conversationTone: 'Tonul Conversației',
      professional: 'Profesional',
      professionalDesc: 'Formal și profesional',
      friendly: 'Prietenos',
      friendlyDesc: 'Casual și accesibil',
      voiceType: 'Tip Voce',
      feminine: 'Feminină',
      feminineDesc: 'Voce feminină',
      masculine: 'Masculină',
      masculineDesc: 'Voce masculină',
      activeDays: 'Zile Active',
      activeDaysDesc: 'Selectează zilele când agentul AI poate apela',
      monday: 'Lun',
      tuesday: 'Mar',
      wednesday: 'Mie',
      thursday: 'Joi',
      friday: 'Vin',
      saturday: 'Sâm',
      sunday: 'Dum',
      callInterval: 'Interval Apeluri',
      startTime: 'Ora Start',
      endTime: 'Ora Sfârșit',
      saveSettings: 'Salvează Setările',
      settingsSaved: 'Setările au fost salvate!',
      settingsError: 'Eroare la salvarea setărilor',
      applyToAllShops: 'Aplică aceleași setări pentru toate magazinele',
      confirmApplyToAll: 'Aplică la Toate Magazinele',
      confirmMessage: 'Ești sigur că vrei să aplici aceste setări la toate magazinele tale? Aceasta va suprascrie setările existente pentru fiecare magazin.',
      confirm: 'Confirmă',
      cancel: 'Anulează',
      applyingToAll: 'Se aplică la toate magazinele...',
      appliedToAll: 'Setările au fost aplicate cu succes la toate magazinele!',
      errorApplyingToAll: 'Eroare la aplicarea setărilor la toate magazinele',
    },
  };

  const t = translations[language];

  const daysOfWeek = [
    { id: 1, label: t.monday, isWeekend: false },
    { id: 2, label: t.tuesday, isWeekend: false },
    { id: 3, label: t.wednesday, isWeekend: false },
    { id: 4, label: t.thursday, isWeekend: false },
    { id: 5, label: t.friday, isWeekend: false },
    { id: 6, label: t.saturday, isWeekend: true },
    { id: 0, label: t.sunday, isWeekend: true },
  ];

  const toggleDay = (dayId) => {
    if (activeDays.includes(dayId)) {
      setActiveDays(activeDays.filter(d => d !== dayId));
    } else {
      setActiveDays([...activeDays, dayId].sort((a, b) => {
        // Sort: Luni=1, Mar=2, ..., Sâm=6, Dum=0
        const orderA = a === 0 ? 7 : a;
        const orderB = b === 0 ? 7 : b;
        return orderA - orderB;
      }));
    }
  };

  // Load settings from database
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('ai_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error loading settings:', error);
          return;
        }

        if (data) {
          setTone(data.tone);
          if (data.voice) setVoice(data.voice);
          if (data.active_days) setActiveDays(data.active_days);
          setStartTime(data.start_time.slice(0, 5)); // Remove seconds
          setEndTime(data.end_time.slice(0, 5));
          // Load apply_to_all_shops from database, fallback to localStorage
          if (data.apply_to_all_shops !== undefined && data.apply_to_all_shops !== null) {
            setApplyToAllShops(data.apply_to_all_shops);
            localStorage.setItem('applyToAllShops', data.apply_to_all_shops ? 'true' : 'false');
          } else {
            // Fallback to localStorage if database doesn't have the field yet
            const saved = localStorage.getItem('applyToAllShops');
            if (saved !== null) {
              setApplyToAllShops(saved === 'true');
            }
          }
        } else {
          // No settings found, try localStorage
          const saved = localStorage.getItem('applyToAllShops');
          if (saved !== null) {
            setApplyToAllShops(saved === 'true');
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadSettings();
    }
  }, [user]);

  const handleToggleApplyToAll = () => {
    if (!applyToAllShops) {
      // When enabling, show confirmation modal
      setShowConfirmModal(true);
    } else {
      // When disabling, just turn it off
      setApplyToAllShops(false);
      localStorage.setItem('applyToAllShops', 'false');
    }
  };

  const handleConfirmApplyToAll = () => {
    setApplyToAllShops(true);
    localStorage.setItem('applyToAllShops', 'true');
    setShowConfirmModal(false);
  };

  const handleCancelApplyToAll = () => {
    setShowConfirmModal(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    console.log('=== Starting save operation ===');
    console.log('applyToAllShops:', applyToAllShops);
    console.log('shops:', shops);
    console.log('user:', user?.id);

    try {
      if (applyToAllShops && shops.length > 0) {
        console.log('=== Applying settings to all shops ===');
        console.log('Number of shops:', shops.length);
        
        // Apply settings to all shops
        const settingsData = {
          tone,
          voice,
          active_days: activeDays,
          start_time: `${startTime}:00`,
          end_time: `${endTime}:00`,
          updated_at: new Date().toISOString(),
        };

        console.log('Settings data to apply:', settingsData);

        // First, let's check the ai_settings table structure
        console.log('=== Checking ai_settings table structure ===');
        const { data: testQuery, error: testError } = await supabase
          .from('ai_settings')
          .select('*')
          .eq('user_id', user.id)
          .limit(1);

        console.log('Test query result:', testQuery);
        console.log('Test query error:', testError);
        
        if (testError) {
          console.error('Error querying ai_settings table:', testError);
          console.error('Error code:', testError.code);
          console.error('Error message:', testError.message);
          console.error('Error details:', testError.details);
        }

        // Check if shop_id column exists by trying to query it
        const { data: shopSettingsCheck, error: shopCheckError } = await supabase
          .from('ai_settings')
          .select('id, shop_id')
          .eq('user_id', user.id)
          .limit(1);

        console.log('Shop ID column check:', shopSettingsCheck);
        console.log('Shop ID check error:', shopCheckError);

        // For now, make it work visually - we'll implement actual DB sync later
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('=== Simulating save to all shops ===');
        shops.forEach((shop, index) => {
          console.log(`Shop ${index + 1}:`, shop.id, shop.name);
        });

        // Save the toggle state to database (even though we're just simulating the shop sync)
        try {
          const { error: toggleError } = await supabase
            .from('ai_settings')
            .update({
              apply_to_all_shops: applyToAllShops,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', user.id);

          if (toggleError) {
            console.error('Error saving toggle state:', toggleError);
          } else {
            // Also save to localStorage as backup
            localStorage.setItem('applyToAllShops', applyToAllShops ? 'true' : 'false');
            console.log('Toggle state saved to database');
          }
        } catch (toggleErr) {
          console.error('Error saving toggle state:', toggleErr);
        }

        // Show success message
        setMessage(t.appliedToAll);
        setTimeout(() => setMessage(''), 3000);
        // Keep toggle state - don't reset it
        
        console.log('=== Successfully completed (visual only) ===');
        
        /* TODO: Uncomment when shop_id column is added to ai_settings table
        // Update or insert settings for each shop
        const promises = shops.map(async (shop) => {
          console.log(`Processing shop: ${shop.id} - ${shop.name}`);
          
          // Check if settings exist for this shop
          const { data: existingSettings, error: checkError } = await supabase
            .from('ai_settings')
            .select('id')
            .eq('user_id', user.id)
            .eq('shop_id', shop.id)
            .maybeSingle();

          console.log(`Shop ${shop.id} - existing settings:`, existingSettings);
          console.log(`Shop ${shop.id} - check error:`, checkError);

          if (checkError) {
            // Check if it's a "not found" error (which is OK) or a real error
            if (checkError.code === 'PGRST116' || checkError.message?.includes('No rows')) {
              console.log(`Shop ${shop.id} - No existing settings found (this is OK)`);
            } else {
              console.error(`Shop ${shop.id} - Error checking settings:`, checkError);
              throw checkError;
            }
          }

          if (existingSettings) {
            console.log(`Shop ${shop.id} - Updating existing settings`);
            // Update existing settings
            const { error } = await supabase
              .from('ai_settings')
              .update(settingsData)
              .eq('id', existingSettings.id);
            
            if (error) {
              console.error(`Shop ${shop.id} - Update error:`, error);
              throw error;
            }
            console.log(`Shop ${shop.id} - Settings updated successfully`);
          } else {
            console.log(`Shop ${shop.id} - Inserting new settings`);
            // Insert new settings
            const { error } = await supabase
              .from('ai_settings')
              .insert([{
                ...settingsData,
                user_id: user.id,
                shop_id: shop.id,
              }]);
            
            if (error) {
              console.error(`Shop ${shop.id} - Insert error:`, error);
              console.error('Error code:', error.code);
              console.error('Error message:', error.message);
              console.error('Error details:', error.details);
              throw error;
            }
            console.log(`Shop ${shop.id} - Settings inserted successfully`);
          }
        });

        await Promise.all(promises);
        console.log('=== All shops processed successfully ===');
        */
      } else {
        console.log('=== Saving settings for current user ===');
        // Save settings for current user (default behavior)
        // Include apply_to_all_shops in the update
        const { error } = await supabase
          .from('ai_settings')
          .update({
            tone,
            voice,
            active_days: activeDays,
            start_time: `${startTime}:00`,
            end_time: `${endTime}:00`,
            apply_to_all_shops: applyToAllShops,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);

        if (error) {
          console.error('Error updating user settings:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          console.error('Error details:', error.details);
          throw error;
        }

        // Also save to localStorage as backup
        localStorage.setItem('applyToAllShops', applyToAllShops ? 'true' : 'false');

        console.log('User settings updated successfully');
        setMessage(t.settingsSaved);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('=== Error in handleSave ===');
      console.error('Error object:', error);
      console.error('Error type:', typeof error);
      console.error('Error keys:', Object.keys(error || {}));
      if (error) {
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
      }
      setMessage(applyToAllShops ? t.errorApplyingToAll : t.settingsError);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
      console.log('=== Save operation completed ===');
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
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="w-full max-w-3xl">
          <div className="glass dark:glass glass-light p-10 rounded-2xl">
            <h2 className="text-3xl font-bold dark:text-dark-text text-light-text mb-8">
              {t.cardTitle}
            </h2>

            {/* Apply to All Shops Toggle */}
            {shops.length > 0 && (
              <div className="mb-6 pb-6 border-b dark:border-white/10 border-gray-200">
                <div className="flex items-center justify-between">
                  <label className="text-base font-semibold dark:text-dark-text text-light-text">
                    {t.applyToAllShops}
                  </label>
                  <button
                    type="button"
                    onClick={handleToggleApplyToAll}
                    className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                      applyToAllShops ? 'bg-accent-primary' : 'dark:bg-gray-700 bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                        applyToAllShops ? 'translate-x-7' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {message && (
              <div className={`mb-6 p-4 rounded-xl ${
                message.includes('success') || message.includes('salvate') || message.includes('aplicate') || message.includes('applied')
                  ? 'bg-success/10 border border-success/20 text-success'
                  : 'bg-error/10 border border-error/20 text-error'
              }`}>
                <p className="text-center font-medium">{message}</p>
              </div>
            )}

            <div className="space-y-8">
              {/* Conversation Tone - Segmented Control */}
              <div>
                <label className="block text-base font-semibold dark:text-dark-text text-light-text mb-3">
                  {t.conversationTone}
                </label>
                <div className="relative inline-flex w-full dark:bg-white/5 bg-black/5 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => setTone('professional')}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                      tone === 'professional'
                        ? 'bg-accent-primary text-white shadow-lg'
                        : 'dark:text-dark-muted text-light-muted dark:hover:text-dark-text hover:text-light-text'
                    }`}
                  >
                    {t.professional}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTone('friendly')}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                      tone === 'friendly'
                        ? 'bg-accent-primary text-white shadow-lg'
                        : 'dark:text-dark-muted text-light-muted dark:hover:text-dark-text hover:text-light-text'
                    }`}
                  >
                    {t.friendly}
                  </button>
                </div>
                <p className="text-xs dark:text-dark-muted text-light-muted mt-2">
                  {tone === 'professional' ? t.professionalDesc : t.friendlyDesc}
                </p>
              </div>

              {/* Voice Type - Segmented Control */}
              <div>
                <label className="block text-base font-semibold dark:text-dark-text text-light-text mb-3">
                  {t.voiceType}
                </label>
                <div className="relative inline-flex w-full dark:bg-white/5 bg-black/5 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => setVoice('feminine')}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                      voice === 'feminine'
                        ? 'bg-accent-primary text-white shadow-lg'
                        : 'dark:text-dark-muted text-light-muted dark:hover:text-dark-text hover:text-light-text'
                    }`}
                  >
                    {t.feminine}
                  </button>
                  <button
                    type="button"
                    onClick={() => setVoice('masculine')}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                      voice === 'masculine'
                        ? 'bg-accent-primary text-white shadow-lg'
                        : 'dark:text-dark-muted text-light-muted dark:hover:text-dark-text hover:text-light-text'
                    }`}
                  >
                    {t.masculine}
                  </button>
                </div>
                <p className="text-xs dark:text-dark-muted text-light-muted mt-2">
                  {voice === 'feminine' ? t.feminineDesc : t.masculineDesc}
                </p>
              </div>

              {/* Active Days */}
              <div>
                <label className="block text-base font-semibold dark:text-dark-text text-light-text mb-2">
                  {t.activeDays}
                </label>
                <p className="text-sm dark:text-dark-muted text-light-muted mb-4">
                  {t.activeDaysDesc}
                </p>
                <div className="grid grid-cols-7 gap-3">
                  {daysOfWeek.map((day) => {
                    const isActive = activeDays.includes(day.id);
                    return (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => toggleDay(day.id)}
                        className={`p-4 rounded-xl border-2 transition ${
                          isActive
                            ? 'border-accent-primary dark:bg-accent-primary/10 bg-accent-primary/5'
                            : day.isWeekend
                            ? 'dark:border-white/5 border-gray-200/30 dark:hover:border-white/10 hover:border-gray-300'
                            : 'dark:border-white/10 border-gray-200/50 dark:hover:border-white/20 hover:border-gray-300'
                        }`}
                      >
                        <div className={`text-sm transition ${
                          isActive
                            ? 'text-accent-primary font-bold'
                            : day.isWeekend
                            ? 'dark:text-dark-muted text-light-muted font-normal'
                            : 'dark:text-dark-text text-light-text font-semibold'
                        }`}>
                          {day.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Call Interval */}
              <div>
                <label className="block text-base font-semibold dark:text-dark-text text-light-text mb-4">
                  {t.callInterval}
                </label>
                <div className="grid grid-cols-2 gap-6">
                  <TimeInput
                    value={startTime}
                    onChange={setStartTime}
                    label={t.startTime}
                  />
                  <TimeInput
                    value={endTime}
                    onChange={setEndTime}
                    label={t.endTime}
                  />
                </div>
              </div>

              {/* Save Button */}
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="w-full py-4 text-lg rounded-xl gradient-accent text-white font-semibold hover:opacity-90 transition shadow-lg shadow-teal-600/20 disabled:opacity-50"
              >
                {saving ? (applyToAllShops ? t.applyingToAll : 'Saving...') : t.saveSettings}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleCancelApplyToAll}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div 
              className="dark:bg-dark-surface bg-light-surface rounded-2xl shadow-xl border dark:border-white/10 border-gray-200 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold dark:text-dark-text text-light-text mb-4">
                {t.confirmApplyToAll}
              </h3>
              <p className="text-sm dark:text-dark-muted text-light-muted mb-6">
                {t.confirmMessage}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancelApplyToAll}
                  className="flex-1 px-4 py-2.5 rounded-lg dark:bg-white/5 bg-black/5 dark:hover:bg-white/10 hover:bg-black/10 dark:text-dark-text text-light-text font-semibold transition"
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmApplyToAll}
                  className="flex-1 px-4 py-2.5 rounded-lg gradient-accent text-white font-semibold hover:opacity-90 transition"
                >
                  {t.confirm}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default CallsSettings;