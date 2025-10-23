import { Moon, Sun, Globe, User } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ title }) => {
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const translations = {
    EN: {
      profile: 'Profile',
      logout: 'Logout',
    },
    RO: {
      profile: 'Profil',
      logout: 'Deconectare',
    },
  };

  const t = translations[language];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get user name from metadata or email
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="h-16 border-b dark:border-white/10 border-gray-200/50 dark:bg-dark-surface bg-light-surface flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-10">
      <h1 className="text-2xl font-bold dark:text-dark-text text-light-text">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLangMenu(!showLangMenu);
              setShowUserMenu(false);
            }}
            className="p-3 rounded-xl dark:hover:bg-white/5 hover:bg-black/5 transition flex items-center gap-2"
          >
            <Globe size={20} className="dark:text-dark-text text-light-text" />
            <span className="font-medium dark:text-dark-text text-light-text">{language}</span>
          </button>

          {showLangMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowLangMenu(false)} />
              <div className="absolute top-full right-0 mt-2 w-36 dark:bg-dark-surface bg-white rounded-xl shadow-lg border dark:border-white/10 border-gray-200/50 overflow-hidden z-20">
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
            </>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-3 rounded-xl dark:hover:bg-white/5 hover:bg-black/5 transition"
        >
          {isDark ? (
            <Sun size={20} className="dark:text-dark-text" />
          ) : (
            <Moon size={20} className="text-light-text" />
          )}
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowLangMenu(false);
            }}
            className="flex items-center gap-3 p-2 rounded-xl dark:hover:bg-white/5 hover:bg-black/5 transition"
          >
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">{userInitials}</span>
            </div>
            <span className="font-medium dark:text-dark-text text-light-text">{userName}</span>
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
              <div className="absolute top-full right-0 mt-2 w-48 dark:bg-dark-surface bg-white rounded-xl shadow-lg border dark:border-white/10 border-gray-200/50 overflow-hidden z-20">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/profile');
                  }}
                  className="w-full px-4 py-2.5 text-left dark:hover:bg-white/5 hover:bg-black/5 dark:text-dark-text text-light-text transition flex items-center gap-2"
                >
                  <User size={18} />
                  <span>{t.profile}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-left dark:hover:bg-white/5 hover:bg-black/5 text-error transition"
                >
                  {t.logout}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;