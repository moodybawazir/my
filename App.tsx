
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import UserPortal from './pages/UserPortal';
import AdminPortal from './pages/AdminPortal';
import ProjectIndustrySelector from './pages/ProjectIndustrySelector';
import ProjectDetail from './pages/ProjectDetail';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import { Layout, AdminLayout } from './components/Layout';
import ServiceSubscriptionsAdmin from './pages/ServiceSubscriptionsAdmin';
import Store from './pages/Store';
import StoreProductDetail from './pages/StoreProductDetail';
import StoreAdmin from './pages/StoreAdmin';
import Policy from './pages/Policy';
import ServicePackages from './pages/ServicePackages';
import { supabase } from './src/lib/supabase';

// Component to catch and process Supabase implicit grant hashes (like access_token=...) 
// when using HashRouter, before it throws a "No routes matched" error.
const AuthCallbackHandler = () => {
  const [searchParams, setSearchParams] = React.useState<URLSearchParams>(new URLSearchParams());

  React.useEffect(() => {
    // Supabase appends #access_token=... to the raw URL, but React Router sees it as the path
    const hashSplit = window.location.hash.split('?')[0];
    let params = new URLSearchParams();

    if (hashSplit.startsWith('#/access_token=')) {
      params = new URLSearchParams(hashSplit.replace('#/access_token=', 'access_token='));
    } else {
      const rawHash = window.location.hash;
      if (rawHash.includes('access_token=')) {
        params = new URLSearchParams(rawHash.substring(rawHash.indexOf('access_token=')));
      }
    }

    setSearchParams(params);
  }, []);

  React.useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');

    if (accessToken && refreshToken) {
      // Set the session explicitly
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      }).then(async () => {
        // Clean URL and redirect based on role
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase.from('users').select('role').eq('id', user.id).single();
          if (data?.role === 'admin') {
            window.location.replace(window.location.origin + '/#/admin');
          } else {
            window.location.replace(window.location.origin + '/#/portal');
          }
        } else {
          window.location.replace(window.location.origin + '/#/');
        }
      });
    } else if (searchParams.toString() === "" && window.location.hash.includes("access_token")) {
      // Still loading params
      return;
    } else {
      // If not a token string, it's a genuine 404, send home
      window.location.href = window.location.origin + '/#/';
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d2226]">
      <div className="w-16 h-16 border-4 border-[#cfd9cc] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

// Component to protect routes that require authentication
const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    if (requireAdmin && user) {
      if (user.email === 'odood48@gmail.com' || user.email === 'mohmmedc@gmail.com') {
        setIsAdmin(true);
      } else {
        supabase.from('users').select('role').eq('id', user.id).single().then(({ data }) => {
          setIsAdmin(data?.role === 'admin');
        });
      }
    }
  }, [user, requireAdmin]);

  if (loading || (requireAdmin && user && isAdmin === null)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d2226]">
        <div className="w-16 h-16 border-4 border-[#cfd9cc] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    // Immediate HashRouter redirection if not logged in
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && isAdmin === false) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/service/:serviceId" element={<ServiceDetail />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:productId" element={<ProductDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/policy/:policyId" element={<Policy />} />
                <Route path="/store" element={<Store />} />
                <Route path="/store/category/:categorySlug" element={<Store />} />
                <Route path="/store/products/:productSlug" element={<StoreProductDetail />} />

                {/* Unified Dynamic Project System */}
                <Route path="/project/:industryId" element={<ProjectIndustrySelector />} />
                <Route path="/product/:id" element={<ProjectDetail />} />

                {/* Protected User Route */}
                <Route path="/portal" element={
                  <ProtectedRoute>
                    <UserPortal />
                  </ProtectedRoute>
                } />

                <Route path="/login" element={<Login />} />
                <Route path="/checkout" element={<Checkout />} />

                {/* Dynamic Sub-Service Packages Route */}
                <Route path="/service/:industryId/:serviceId/packages" element={<ServicePackages />} />

                {/* Fallback route to catch Supabase hash fragments */}
                <Route path="*" element={<AuthCallbackHandler />} />
              </Route>

              {/* Protected Admin Routes */}
              <Route element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route path="/admin" element={<AdminPortal />} />
                <Route path="/admin/services/:id/subscriptions" element={<ServiceSubscriptionsAdmin />} />
                <Route path="/admin/store" element={<StoreAdmin />} />
              </Route>
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
