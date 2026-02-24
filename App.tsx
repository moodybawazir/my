
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './src/context/AuthContext';
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

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
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

              {/* Unified Dynamic Project System */}
              <Route path="/project/:industryId" element={<ProjectIndustrySelector />} />
              <Route path="/product/:id" element={<ProjectDetail />} />
              <Route path="/portal" element={<UserPortal />} />
              <Route path="/login" element={<Login />} />
              <Route path="/checkout" element={<Checkout />} />
            </Route>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminPortal />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
