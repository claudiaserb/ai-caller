import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import CallsSettings from './pages/CallsSettings';
import OrdersConfirmation from './pages/OrdersConfirmation';
import DraftsConfirmation from './pages/DraftsConfirmation';
import Products from './pages/Products';

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" replace /> : <Register />}
        />
        <Route
          path="/forgot-password"
          element={user ? <Navigate to="/" replace /> : <ForgotPassword />}
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calls-settings"
          element={
            <ProtectedRoute>
              <CallsSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders-confirmation"
          element={
            <ProtectedRoute>
              <OrdersConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drafts-confirmation"
          element={
            <ProtectedRoute>
              <DraftsConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;