import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Moon, Sun, Globe, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const translations = {
    EN: {
      title: 'Ordify',
      subtitle: 'Automate order confirmations with AI',
      email: 'Email',
      emailPlaceholder: 'Enter your email',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      signIn: 'Sign In',
      noAccount: "Don't have an account?",
      signUp: 'Sign up',
      forgotPassword: 'Forgot password?',
      invalidCredentials: 'Invalid email or password',
    },
    RO: {
      title: 'Ordify',
      subtitle: 'Automatizează confirmarea comenzilor cu AI',
      email: 'Email',
      emailPlaceholder: 'Introdu email-ul',
      password: 'Parolă',
      passwordPlaceholder: 'Introdu parola',
      signIn: 'Autentificare',
      noAccount: 'Nu ai cont?',
      signUp: 'Înregistrează-te',
      forgotPassword: 'Ai uitat parola?',
      invalidCredentials: 'Email sau parolă invalidă',
    },
  };

  const t = translations[language];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError(t.invalidCredentials);
    } finally {
      setLoading(false);
    }
  };

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

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/20">
              <p className="text-error text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium dark:text-dark-text text-light-text mb-2">{t.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                className="w-full px-4 py-3 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-gray-200/50 dark:text-dark-text text-light-text placeholder:dark:text-dark-muted placeholder:text-light-muted focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium dark:text-dark-text text-light-text mb-2">{t.password}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className="w-full px-4 py-3 pr-12 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-gray-200/50 dark:text-dark-text text-light-text placeholder:dark:text-dark-muted placeholder:text-light-muted focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 dark:text-dark-muted text-light-muted hover:dark:text-dark-text hover:text-light-text transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl gradient-accent text-white font-semibold hover:opacity-90 transition shadow-lg shadow-accent-primary/20 disabled:opacity-50"
            >
              {loading ? '...' : t.signIn}
            </button>
          </form>

          <div className="text-center mt-6 space-y-2">
            <div className="text-sm dark:text-dark-muted text-light-muted">
              <span>{t.noAccount} </span>
              <button
                onClick={() => navigate('/register')}
                className="text-accent-primary hover:text-accent-secondary font-medium transition"
              >
                {t.signUp}
              </button>
            </div>
            <div className="text-sm">
              <button
                onClick={() => navigate('/forgot-password')}
                className="text-accent-primary hover:text-accent-secondary font-medium transition"
              >
                {t.forgotPassword}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;