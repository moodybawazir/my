
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Services from './pages/Services';
import Products from './pages/Products';
import UserPortal from './pages/UserPortal';
import AdminPortal from './pages/AdminPortal';
import ProjectRealEstate from './pages/ProjectRealEstate';
import ProjectAI from './pages/ProjectAI';
import ProjectMedical from './pages/ProjectMedical';
import ProjectCafe from './pages/ProjectCafe';
import ProjectEcommerce from './pages/ProjectEcommerce';
import ProjectAccounting from './pages/ProjectAccounting';
import ProjectDetail from './pages/ProjectDetail';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import { Layout, AdminLayout } from './components/Layout';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/products" element={<Products />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/project/real-estate" element={<ProjectRealEstate />} />
          <Route path="/project/ai-assistant" element={<ProjectAI />} />
          <Route path="/project/medical" element={<ProjectMedical />} />
          <Route path="/project/cafe" element={<ProjectCafe />} />
          <Route path="/project/ecommerce" element={<ProjectEcommerce />} />
          <Route path="/project/accounting" element={<ProjectAccounting />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/portal" element={<UserPortal />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminPortal />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
