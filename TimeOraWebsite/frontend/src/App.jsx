import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/common/Layout.jsx';
import toast from 'react-hot-toast';

// Context Providers
import { AuthProvider, AuthContext } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';

// Customer Pages
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Profile from './pages/Profile.jsx';
import Wishlist from './pages/Wishlist.jsx';

// Secondary Customer Pages
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import FAQ from './pages/FAQ.jsx';
import ShippingPolicy from './pages/ShippingPolicy.jsx';
import ReturnPolicy from './pages/ReturnPolicy.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsConditions from './pages/TermsConditions.jsx';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminProducts from './pages/AdminProducts.jsx';
import AdminOrders from './pages/AdminOrders.jsx';
import AdminCoupons from './pages/AdminCoupons.jsx';
import AdminReviews from './pages/AdminReviews.jsx';

// Custom Route Protection Gatekeepers
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] text-white">
        <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] text-white">
        <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    toast.error('Restricted access. Administrators only.');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            
            <Layout>
              <Routes>
                {/* Public Shop routes */}
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/products/:identifier" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />

                {/* Secondary Customer Routes */}
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/shipping-policy" element={<ShippingPolicy />} />
                <Route path="/return-policy" element={<ReturnPolicy />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-conditions" element={<TermsConditions />} />

                {/* Authentication routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

                {/* Protected Client Dashboard and order placing */}
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/order-success/:orderId" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                {/* Protected Admin Control Center */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
                <Route path="/admin/coupons" element={<AdminRoute><AdminCoupons /></AdminRoute>} />
                <Route path="/admin/reviews" element={<AdminRoute><AdminReviews /></AdminRoute>} />

                {/* Catch-all fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>

          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
