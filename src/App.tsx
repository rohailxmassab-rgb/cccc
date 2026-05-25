/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { Details } from './pages/Details';
import { Cart } from './pages/Cart';
import { Auth } from './pages/Auth';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

function AppContent() {
  const { loading, user } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-matte-black gap-6">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-neon-red drop-shadow-[0_0_20px_rgba(255,62,62,0.8)]"
        >
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
          </svg>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold font-display neon-text"
        >
          ALFLIX
        </motion.h1>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: 200 }}
          transition={{ duration: 2 }}
          className="h-1 bg-gradient-to-r from-neon-red to-orange-500 rounded-full"
        />
      </div>
    );
  }

  if (loading) return null;

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/item/:id" element={<Details />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/auth" element={user ? <Navigate to="/profile" /> : <Auth />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/auth" />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
