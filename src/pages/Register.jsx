import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Moon, Sun, Globe, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { signUp } = useAuth();
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
              disabled={loading}
              className="w-full py-3 rounded-xl gradient-accent text-white font-semibold hover:opacity-90 transition shadow-lg shadow-accent-primary/20 disabled:opacity-50"
            >
              {loading ? '...' : t.signUp}
            </button>
          </form>

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