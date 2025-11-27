import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Moon, Sun, Globe, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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
      continueWithGoogle: 'Continue with Google',
      or: 'or',
      googleError: 'Google sign-in failed. Please try again.',
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
      continueWithGoogle: 'Continuă cu Google',
      or: 'sau',
      googleError: 'Autentificarea cu Google a eșuat. Te rog încearcă din nou.',
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

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
      // Note: OAuth redirects to Google, so navigation happens automatically
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError(t.googleError);
      setGoogleLoading(false);
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
              disabled={loading || googleLoading}
              className="w-full py-3 rounded-xl gradient-accent text-white font-semibold hover:opacity-90 transition shadow-lg shadow-teal-600/20 disabled:opacity-50"
            >
              {loading ? '...' : t.signIn}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t dark:border-white/10 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-inherit dark:text-dark-muted text-light-muted">{t.or}</span>
            </div>
          </div>

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            className="w-full py-3 px-4 rounded-xl bg-white dark:bg-white border border-gray-300 dark:border-gray-300 text-gray-700 dark:text-gray-700 font-medium hover:bg-gray-50 dark:hover:bg-gray-50 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>{t.continueWithGoogle}</span>
              </>
            )}
          </button>

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