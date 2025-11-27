import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useEffect } from 'react';
import { supabase } from './lib/supabase';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CallsSettings from './pages/CallsSettings';
import OrdersConfirmation from './pages/OrdersConfirmation';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Stores from './pages/Stores';
import Profile from './pages/Profile';

function AppRoutes() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle OAuth callback - Supabase automatically processes hash fragments
  useEffect(() => {
    const handleAuthCallback = async () => {
      // Check if we have hash fragments (OAuth callback)
      if (location.hash && location.hash.includes('access_token')) {
        console.log('OAuth callback detected, processing...');
        
        // Supabase automatically handles hash fragments when getSession() is called
        // But we can also explicitly get the session to ensure it's processed
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session from OAuth callback:', error);
        } else if (session) {
          console.log('OAuth session established for:', session.user.email);
          // Clear hash from URL for security, but preserve query parameters
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
          // The auth state change listener will update the user state
          // and App.jsx routing will automatically redirect to dashboard
        }
      }
    };

    handleAuthCallback();
  }, [location.hash]);

  // Redirect authenticated users away from login/register pages
  useEffect(() => {
    if (!loading && user) {
      if (location.pathname === '/login' || location.pathname === '/register') {
        console.log('User authenticated, redirecting to dashboard');
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, loading, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />
      <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
      <Route path="/calls-settings" element={user ? <CallsSettings /> : <Navigate to="/login" replace />} />
      <Route path="/orders-confirmation" element={user ? <OrdersConfirmation /> : <Navigate to="/login" replace />} />
      <Route path="/orders" element={user ? <Orders /> : <Navigate to="/login" replace />} />
      <Route path="/products" element={user ? <Products /> : <Navigate to="/login" replace />} />
      <Route path="/stores" element={user ? <Stores /> : <Navigate to="/login" replace />} />
      <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;