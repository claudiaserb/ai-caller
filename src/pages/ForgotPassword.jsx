import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Moon, Sun, Globe, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState(false);

  const translations = {
    EN: {
      title: 'Forgot Password',
      subtitle: 'Enter your email to reset your password',
      email: 'Email',
      emailPlaceholder: 'Enter your email',
      sendLink: 'Send Reset Link',
      backToLogin: 'Back to Login',
      successTitle: 'Check Your Email',
      successMessage: 'We sent a password reset link to',
      emailInvalid: 'Email must contain @',
    },
    RO: {
      title: 'Ai Uitat Parola',
      subtitle: 'Introdu email-ul pentru a reseta parola',
      email: 'Email',
      emailPlaceholder: 'Introdu email-ul',
      sendLink: 'Trimite Link de Resetare',
      backToLogin: 'Înapoi la Autentificare',
      successTitle: 'Verifică Email-ul',
      successMessage: 'Am trimis un link de resetare la',
      emailInvalid: 'Email-ul trebuie să conțină @',
    },
  };

  const t = translations[language];

  const validateEmail = (email) => {
    return email.includes('@');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);

    if (validateEmail(email)) {
      console.log('Password reset link sent to:', email);
      setSubmitted(true);
    }
  };

  const showEmailError = touched && email && !validateEmail(email);

  if (submitted) {
    return (
      <div className="min-h-screen dark:bg-dark-bg bg-light-bg flex items-center justify-center p-4 relative">
        <div className="absolute top-6 right-6 flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="p-3 rounded-xl dark:bg-dark-surface bg-light-surface dark:hover:bg-white/5 hover:bg-black/5 transition border dark:border-white/10 border-gray-200/50 flex items-center gap-2"
            >
              <Globe size={20} className="dark:text-dark-text text-light-text" />
              <span className="font-medium dark:text-dark-text text-light-text">{language}</span>
            </button>

            {showLangMenu && (
              <div className="absolute top-full right-0 mt-2 w-36 dark:bg-dark-surface bg-white rounded-xl shadow-lg border dark:border-white/10 border-gray-200/50 overflow-hidden z-10">
                <button
                  onClick={() => {
                    setLanguage('EN');
                    setShowLangMenu(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left transition ${
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
                  className={`w-full px-4 py-2.5 text-left transition ${
                    language === 'RO'
                      ? 'dark:bg-white/10 bg-black/5 text-accent-primary'
                      : 'dark:hover:bg-white/5 hover:bg-black/5 dark:text-dark-text text-light-text'
                  }`}
                >
                  Română
                </button>
              </div>
            )}
          </div>

          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl dark:bg-dark-surface bg-light-surface dark:hover:bg-white/5 hover:bg-black/5 transition border dark:border-white/10 border-gray-200/50"
          >
            {isDark ? <Sun size={20} className="dark:text-dark-text" /> : <Moon size={20} className="text-light-text" />}
          </button>
        </div>

        <div className="w-full max-w-md">
          <div className="glass dark:glass glass-light p-8 rounded-3xl shadow-xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-success text-3xl">✓</span>
              </div>
              <h1 className="text-3xl font-bold dark:text-dark-text text-light-text mb-2">{t.successTitle}</h1>
              <p className="dark:text-dark-muted text-light-muted mb-2">{t.successMessage}</p>
              <p className="text-accent-primary font-medium">{email}</p>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 rounded-xl gradient-accent text-white font-semibold hover:opacity-90 transition shadow-lg shadow-accent-primary/20"
            >
              {t.backToLogin}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-dark-bg bg-light-bg flex items-center justify-center p-4 relative">
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="p-3 rounded-xl dark:bg-dark-surface bg-light-surface dark:hover:bg-white/5 hover:bg-black/5 transition border dark:border-white/10 border-gray-200/50 flex items-center gap-2"
          >
            <Globe size={20} className="dark:text-dark-text text-light-text" />
            <span className="font-medium dark:text-dark-text text-light-text">{language}</span>
          </button>

          {showLangMenu && (
            <div className="absolute top-full right-0 mt-2 w-36 dark:bg-dark-surface bg-white rounded-xl shadow-lg border dark:border-white/10 border-gray-200/50 overflow-hidden z-10">
              <button
                onClick={() => {
                  setLanguage('EN');
                  setShowLangMenu(false);
                }}
                className={`w-full px-4 py-2.5 text-left transition ${
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
                className={`w-full px-4 py-2.5 text-left transition ${
                  language === 'RO'
                    ? 'dark:bg-white/10 bg-black/5 text-accent-primary'
                    : 'dark:hover:bg-white/5 hover:bg-black/5 dark:text-dark-text text-light-text'
                }`}
              >
                Română
              </button>
            </div>
          )}
        </div>

        <button
          onClick={toggleTheme}
          className="p-3 rounded-xl dark:bg-dark-surface bg-light-surface dark:hover:bg-white/5 hover:bg-black/5 transition border dark:border-white/10 border-gray-200/50"
        >
          {isDark ? <Sun size={20} className="dark:text-dark-text" /> : <Moon size={20} className="text-light-text" />}
        </button>
      </div>

      <div className="w-full max-w-md">
        <div className="glass dark:glass glass-light p-8 rounded-3xl shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">O</span>
            </div>
            <h1 className="text-3xl font-bold dark:text-dark-text text-light-text mb-2">{t.title}</h1>
            <p className="dark:text-dark-muted text-light-muted">{t.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium dark:text-dark-text text-light-text mb-2">{t.email}</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder={t.emailPlaceholder}
                className="w-full px-4 py-3 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-gray-200/50 dark:text-dark-text text-light-text placeholder:dark:text-dark-muted placeholder:text-light-muted focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
              />
              {showEmailError && <p className="text-error text-xs mt-1">{t.emailInvalid}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl gradient-accent text-white font-semibold hover:opacity-90 transition shadow-lg shadow-accent-primary/20"
            >
              {t.sendLink}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 mx-auto text-accent-primary hover:text-accent-secondary font-medium transition"
            >
              <ArrowLeft size={18} />
              <span>{t.backToLogin}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;