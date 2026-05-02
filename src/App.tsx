import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/common/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Members/Profile';
import Registration from './pages/Members/Registration';
import Trainers from './pages/Trainers/TrainerList';
import WorkoutPlans from './pages/Plans/WorkoutPlans';
import DietPlans from './pages/Plans/DietPlans';
import Equipment from './pages/Equipment/Shop';
import Cart from './pages/Equipment/Cart';
import Checkout from './pages/Equipment/Checkout';
import About from './pages/About';
import FAQ from './pages/FAQ/FAQList';
import Contact from './pages/Contact/ContactForm';
import GymRules from './pages/Rules/GymRules';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import MembersManager from './pages/Admin/MembersManager';
import TrainersManager from './pages/Admin/TrainersManager';
import PlansManager from './pages/Admin/PlansManager';
import FAQManager from './pages/Admin/FAQManager';
import EquipmentManager from './pages/Admin/EquipmentManager';
import SettingsManager from './pages/Admin/SettingsManager';

const PrivateRoute: React.FC<{ children: React.ReactNode; requireAdmin?: boolean }> = ({ children, requireAdmin }) => {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <div className="flex h-screen items-center justify-center bg-zinc-950 text-orange-600 font-black uppercase tracking-tighter">Initializing Session...</div>;
  
  if (!user) return <Navigate to="/login" />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" />;
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/trainers" element={<Trainers />} />
      <Route path="/workout-plans" element={<WorkoutPlans />} />
      <Route path="/diet-plans" element={<DietPlans />} />
      <Route path="/equipment" element={<Equipment />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/about" element={<About />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/rules" element={<GymRules />} />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      
      {/* Admin Routes */}
      <Route path="/adminpanel456" element={<AdminLogin />} />
      <Route
        path="/admin/*"
        element={
          <PrivateRoute requireAdmin>
            <AdminDashboard />
          </PrivateRoute>
        }
      >
        <Route path="members" element={<MembersManager />} />
        <Route path="trainers" element={<TrainersManager />} />
        <Route path="plans" element={<PlansManager />} />
        <Route path="faq" element={<FAQManager />} />
        <Route path="equipment" element={<EquipmentManager />} />
        <Route path="settings" element={<SettingsManager />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <SettingsProvider>
          <CartProvider>
            <Layout>
              <AppRoutes />
            </Layout>
          </CartProvider>
        </SettingsProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
