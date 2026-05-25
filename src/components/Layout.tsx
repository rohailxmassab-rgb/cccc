import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, ShoppingCart, User, UtensilsCrossed, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { totalItems } = useCart();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-matte-black relative overflow-hidden flex flex-col lg:flex-row antialiased">
      {/* Background Ambient Glows */}
      <div className="ambient-glow top-[-100px] left-[-100px] w-[600px] h-[600px] bg-neon-red opacity-[0.07]" />
      <div className="ambient-glow bottom-[-50px] right-[200px] w-[500px] h-[500px] bg-neon-red opacity-[0.03]" />
      
      {/* Top Animated Line Effect */}
      <div className="fixed top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-red to-transparent opacity-40 z-[60]" />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-24 xl:w-28 h-screen bg-black/40 backdrop-blur-3xl border-r border-white/10 flex-col items-center py-10 gap-12 z-50 sticky top-0">
        <motion.div 
          whileHover={{ scale: 1.1 }}
          onClick={() => navigate('/')}
          className="text-neon-red font-black text-3xl tracking-tighter cursor-pointer italic"
        >
          A.
        </motion.div>
        
        <nav className="flex flex-col gap-10">
          <SidebarNavButton to="/" icon={<Home />} label="Home" />
          <SidebarNavButton to="/menu" icon={<UtensilsCrossed />} label="Menu" />
          <SidebarNavButton to="/cart" icon={
            <div className="relative">
              <ShoppingCart />
              {totalItems > 0 && <span className="absolute -top-1.5 -right-1.5 bg-neon-red text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">{totalItems}</span>}
            </div>
          } label="Cart" />
          <SidebarNavButton to={user ? "/profile" : "/auth"} icon={<User />} label="User" />
          {isAdmin && <SidebarNavButton to="/admin" icon={<ShieldCheck className="text-neon-orange" />} label="Admin" />}
        </nav>

        <div className="mt-auto">
          {user && (
            <motion.img 
              whileHover={{ scale: 1.1 }}
              onClick={() => navigate('/profile')}
              src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
              className="w-10 h-10 rounded-2xl border border-white/20 cursor-pointer object-cover"
            />
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header - Mobile Only Branding, Desktop Utility */}
        <header className="p-6 xl:px-12 flex justify-between items-center bg-transparent z-40 sticky top-0">
          <div className="lg:hidden">
            <motion.div onClick={() => navigate('/')} className="flex items-center gap-2">
              <UtensilsCrossed className="text-neon-red w-7 h-7" />
              <span className="text-2xl font-black font-display tracking-tighter italic">ALFLIX<span className="text-neon-red">.</span></span>
            </motion.div>
          </div>

          <div className="hidden lg:block">
             <h1 className="text-2xl font-black tracking-tight font-display">ALFLIX<span className="text-neon-red">.</span> <span className="text-white/20 font-light text-sm uppercase tracking-[0.3em] ml-4">Gourmet Sector 01</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex glass rounded-full px-5 py-2 items-center gap-3 backdrop-blur-md">
              <span className="text-[10px] font-black text-neon-red tracking-widest uppercase">Targeting</span>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Global Sector</span>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="p-3 glass rounded-2xl lg:hidden"
            >
              <Search className="w-5 h-5 text-gray-400" />
            </motion.button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-32 lg:pb-12 scrollbar-hide px-6 xl:px-12 lg:pt-2">
          <div className="max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={window.location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Bottom Navigation - Mobile Only */}
        <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] sm:max-w-md h-20 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[32px] flex items-center justify-around px-4 shadow-[0_30px_60px_rgba(0,0,0,0.5)] z-50">
          <NavButton to="/" icon={<Home />} label="Home" />
          <NavButton to="/menu" icon={<UtensilsCrossed />} label="Menu" />
          <NavButton to="/cart" icon={
            <div className="relative">
              <ShoppingCart />
              {totalItems > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-neon-red text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-black shadow-[0_0_10px_rgba(255,77,0,0.4)]"
                >
                  {totalItems}
                </motion.span>
              )}
            </div>
          } label="Cart" />
          <NavButton to={user ? "/profile" : "/auth"} icon={<User />} label="Profile" />
        </nav>
      </div>
    </div>
  );
};

const NavButton: React.FC<{ to: string, icon: React.ReactNode, label: string }> = ({ to, icon, label }) => {
  return (
    <NavLink to={to} className={({ isActive }) => `
      flex flex-col items-center justify-center gap-1 transition-all duration-300
      ${isActive ? 'text-neon-red scale-110' : 'text-white/40 hover:text-white'}
    `}>
      {({ isActive }) => (
        <>
          <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-neon-red/10' : ''}`}>
            {React.cloneElement(icon as React.ReactElement, { size: 24 })}
          </div>
          <span className="text-[10px] font-black tracking-widest uppercase">{label}</span>
        </>
      )}
    </NavLink>
  );
};

const SidebarNavButton: React.FC<{ to: string, icon: React.ReactNode, label: string }> = ({ to, icon, label }) => {
  return (
    <NavLink to={to} className={({ isActive }) => `
      p-4 rounded-2xl transition-all relative group
      ${isActive ? 'bg-neon-red/10 text-neon-red border border-neon-red/20' : 'text-white/40 hover:text-white hover:bg-white/5'}
    `}>
      {React.cloneElement(icon as React.ReactElement, { size: 24 })}
      <div className="absolute left-full ml-4 px-3 py-1.5 bg-neon-red text-white text-[10px] font-black uppercase rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        {label}
      </div>
    </NavLink>
  );
};
