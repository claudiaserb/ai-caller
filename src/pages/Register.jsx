import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Moon, Sun, Globe, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const translations = {
    EN: {
      title: 'Create Account',
      subtitle: 'Get started with Ordify',
      name: 'Full Name',
      namePlaceholder: 'Enter your full name',
      email: 'Email',
      emailPlaceholder: 'Enter your email',
      phone: 'Phone Number',
      phonePlaceholder: '0712345678',
      password: 'Password',
      passwordPlaceholder: 'Create a password',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Confirm your password',
      signUp: 'Sign Up',
      haveAccount: 'Already have an account?',
      signIn: 'Sign in',
      emailInvalid: 'Email must contain @',
      passwordWeak: 'Password must contain: uppercase, number, special character',
      passwordMismatch: 'Passwords do not match',
      phoneInvalid: 'Phone must start with 07 and have 10 digits',
      nameRequired: 'Name is required',
      registrationError: 'Registration failed. Please try again.',
      continueWithGoogle: 'Continue with Google',
      or: 'or',
      googleError: 'Google sign-in failed. Please try again.',
    },
    RO: {
      title: 'Creare Cont',
      subtitle: 'Începe cu Ordify',
      name: 'Nume Complet',
      namePlaceholder: 'Introdu numele complet',
      email: 'Email',
      emailPlaceholder: 'Introdu email-ul',
      phone: 'Număr de Telefon',
      phonePlaceholder: '0712345678',
      password: 'Parolă',
      passwordPlaceholder: 'Crează o parolă',
      confirmPassword: 'Confirmă Parola',
      confirmPasswordPlaceholder: 'Confirmă parola',
      signUp: 'Înregistrare',
      haveAccount: 'Ai deja cont?',
      signIn: 'Autentifică-te',
      emailInvalid: 'Email-ul trebuie să conțină @',
      passwordWeak: 'Parola trebuie să conțină: majusculă, cifră, caracter special',
      passwordMismatch: 'Parolele nu coincid',
      phoneInvalid: 'Telefonul trebuie să înceapă cu 07 și să aibă 10 cifre',
      nameRequired: 'Numele este obligatoriu',
      registrationError: 'Înregistrarea a eșuat. Te rog încearcă din nou.',
      continueWithGoogle: 'Continuă cu Google',
      or: 'sau',
      googleError: 'Autentificarea cu Google a eșuat. Te rog încearcă din nou.',
    },
  };

  const t = translations[language];

  const validateEmail = (email) => {
    return email.includes('@');
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUpperCase && hasNumber && hasSpecialChar;
  };

  const validatePhone = (phone) => {
    return phone.startsWith('07') && phone.length === 10 && /^\d+$/.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    });

    if (
      !formData.name ||
      !validateEmail(formData.email) ||
      !validatePhone(formData.phone) ||
      !validatePassword(formData.password) ||
      formData.password !== formData.confirmPassword
    ) {
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.name, formData.phone);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || t.registrationError);
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

  const showEmailError = touched.email && formData.email && !validateEmail(formData.email);
  const showPasswordError = touched.password && formData.password && !validatePassword(formData.password);
  const showPhoneError = touched.phone && formData.phone && !validatePhone(formData.phone);
  const showPasswordMismatchError = touched.confirmPassword && formData.confirmPassword && formData.password !== formData.confirmPassword;
  const showNameError = touched.name && !formData.name;

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
              <label className="block text-sm font-medium dark:text-dark-text text-light-text mb-2">{t.name}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur('name')}
                placeholder={t.namePlaceholder}
                className="w-full px-4 py-3 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-gray-200/50 dark:text-dark-text text-light-text placeholder:dark:text-dark-muted placeholder:text-light-muted focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
              />
              {showNameError && <p className="text-error text-xs mt-1">{t.nameRequired}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium dark:text-dark-text text-light-text mb-2">{t.email}</label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                placeholder={t.emailPlaceholder}
                className="w-full px-4 py-3 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-gray-200/50 dark:text-dark-text text-light-text placeholder:dark:text-dark-muted placeholder:text-light-muted focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
              />
              {showEmailError && <p className="text-error text-xs mt-1">{t.emailInvalid}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium dark:text-dark-text text-light-text mb-2">{t.phone}</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={() => handleBlur('phone')}
                placeholder={t.phonePlaceholder}
                className="w-full px-4 py-3 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-gray-200/50 dark:text-dark-text text-light-text placeholder:dark:text-dark-muted placeholder:text-light-muted focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
              />
              {showPhoneError && <p className="text-error text-xs mt-1">{t.phoneInvalid}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium dark:text-dark-text text-light-text mb-2">{t.password}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  placeholder={t.passwordPlaceholder}
                  className="w-full px-4 py-3 pr-12 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-gray-200/50 dark:text-dark-text text-light-text placeholder:dark:text-dark-muted placeholder:text-light-muted focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 dark:text-dark-muted text-light-muted hover:dark:text-dark-text hover:text-light-text transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {showPasswordError && <p className="text-error text-xs mt-1">{t.passwordWeak}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium dark:text-dark-text text-light-text mb-2">{t.confirmPassword}</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur('confirmPassword')}
                  placeholder={t.confirmPasswordPlaceholder}
                  className="w-full px-4 py-3 pr-12 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-gray-200/50 dark:text-dark-text text-light-text placeholder:dark:text-dark-muted placeholder:text-light-muted focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 dark:text-dark-muted text-light-muted hover:dark:text-dark-text hover:text-light-text transition"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {showPasswordMismatchError && <p className="text-error text-xs mt-1">{t.passwordMismatch}</p>}
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-3 rounded-xl gradient-accent text-white font-semibold hover:opacity-90 transition shadow-lg shadow-teal-600/20 disabled:opacity-50"
            >
              {loading ? '...' : t.signUp}
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

          <div className="text-center mt-6 text-sm dark:text-dark-muted text-light-muted">
            <span>{t.haveAccount} </span>
            <button
              onClick={() => navigate('/login')}
              className="text-accent-primary hover:text-accent-secondary font-medium transition"
            >
              {t.signIn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;