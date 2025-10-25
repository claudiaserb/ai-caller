import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
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
  const [tone, setTone] = useState('professional');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const translations = {
    EN: {
      pageTitle: 'Calls Settings',
      cardTitle: 'Configure AI Agent',
      conversationTone: 'Conversation Tone',
      professional: 'Professional',
      professionalDesc: 'Formal and business-like',
      friendly: 'Friendly',
      friendlyDesc: 'Casual and approachable',
      callInterval: 'Call Interval',
      startTime: 'Start Time',
      endTime: 'End Time',
      saveSettings: 'Save Settings',
      settingsSaved: 'Settings saved successfully!',
      settingsError: 'Failed to save settings',
    },
    RO: {
      pageTitle: 'Setări Apeluri',
      cardTitle: 'Configurare Agent AI',
      conversationTone: 'Tonul Conversației',
      professional: 'Profesional',
      professionalDesc: 'Formal și profesional',
      friendly: 'Prietenos',
      friendlyDesc: 'Casual și accesibil',
      callInterval: 'Interval Apeluri',
      startTime: 'Ora Start',
      endTime: 'Ora Sfârșit',
      saveSettings: 'Salvează Setările',
      settingsSaved: 'Setările au fost salvate!',
      settingsError: 'Eroare la salvarea setărilor',
    },
  };

  const t = translations[language];

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
          setStartTime(data.start_time.slice(0, 5)); // Remove seconds
          setEndTime(data.end_time.slice(0, 5));
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

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('ai_settings')
        .update({
          tone,
          start_time: `${startTime}:00`,
          end_time: `${endTime}:00`,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setMessage(t.settingsSaved);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage(t.settingsError);
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

            {message && (
              <div className={`mb-6 p-4 rounded-xl ${
                message.includes('success') || message.includes('salvate')
                  ? 'bg-success/10 border border-success/20 text-success'
                  : 'bg-error/10 border border-error/20 text-error'
              }`}>
                <p className="text-center font-medium">{message}</p>
              </div>
            )}

            <div className="space-y-8">
              {/* Conversation Tone */}
              <div>
                <label className="block text-base font-semibold dark:text-dark-text text-light-text mb-4">
                  {t.conversationTone}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setTone('professional')}
                    className={`p-6 rounded-xl border-2 transition ${
                      tone === 'professional'
                        ? 'border-accent-primary dark:bg-accent-primary/10 bg-accent-primary/5'
                        : 'dark:border-white/10 border-gray-200/50 dark:hover:border-white/20 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-lg dark:text-dark-text text-light-text mb-2">
                      {t.professional}
                    </div>
                    <div className="text-sm dark:text-dark-muted text-light-muted">
                      {t.professionalDesc}
                    </div>
                  </button>

                  <button
                    onClick={() => setTone('friendly')}
                    className={`p-6 rounded-xl border-2 transition ${
                      tone === 'friendly'
                        ? 'border-accent-primary dark:bg-accent-primary/10 bg-accent-primary/5'
                        : 'dark:border-white/10 border-gray-200/50 dark:hover:border-white/20 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-lg dark:text-dark-text text-light-text mb-2">
                      {t.friendly}
                    </div>
                    <div className="text-sm dark:text-dark-muted text-light-muted">
                      {t.friendlyDesc}
                    </div>
                  </button>
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
                onClick={handleSave}
                disabled={saving}
                className="w-full py-4 text-lg rounded-xl gradient-accent text-white font-semibold hover:opacity-90 transition shadow-lg shadow-accent-primary/20 disabled:opacity-50"
              >
                {saving ? 'Saving...' : t.saveSettings}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CallsSettings;