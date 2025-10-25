import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CallsSettings from './pages/CallsSettings';
import OrdersConfirmation from './pages/OrdersConfirmation';
import Orders from './pages/Orders';
import Products from './pages/Products';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/calls-settings" element={user ? <CallsSettings /> : <Navigate to="/login" />} />
        <Route path="/orders-confirmation" element={user ? <OrdersConfirmation /> : <Navigate to="/login" />} />
        <Route path="/orders" element={user ? <Orders /> : <Navigate to="/login" />} />
        <Route path="/products" element={user ? <Products /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;