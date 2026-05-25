import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { LogOut, Settings, Package, ChevronRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { logout, db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Order } from '../types';

export const Profile: React.FC = () => {
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'orders'), 
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc')
        );
        const snapshot = await getDocs(q);
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) return null;

  return (
    <div className="px-6 space-y-8 pt-4">
      {/* Profile Header */}
      <div className="flex flex-col items-center space-y-4 pt-4">
        <div className="relative group">
          <div className="absolute inset-0 bg-neon-red blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
          <motion.img 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
            alt="Profile" 
            className="w-32 h-32 rounded-3xl border-2 border-neon-red/30 object-cover relative z-10"
          />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold font-display">{user.displayName || 'Citizen'}</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
        
        {isAdmin && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 px-6 py-2 glass rounded-full text-neon-orange border-neon-orange/30 font-bold text-xs uppercase tracking-tighter"
          >
            <ShieldCheck size={16} />
            <span>Overlord Console</span>
          </motion.button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass p-4 rounded-3xl text-center space-y-1">
          <span className="text-2xl font-bold text-neon-red">{orders.length}</span>
          <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Missions</p>
        </div>
        <div className="glass p-4 rounded-3xl text-center space-y-1">
          <span className="text-2xl font-bold text-neon-orange">4.9k</span>
          <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">XP Points</p>
        </div>
      </div>

      {/* Order History */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="font-bold font-display flex items-center gap-2">
            <Package size={18} className="text-neon-red" />
            Recent Missions
          </h3>
          <button className="text-xs text-neon-red">View Log</button>
        </div>

        <div className="space-y-3">
          {loading ? (
             <div className="animate-pulse bg-white/5 h-20 rounded-3xl" />
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass p-4 rounded-3xl flex justify-between items-center group cursor-pointer hover:bg-white/5"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-500">#{order.id?.slice(-6).toUpperCase()}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      order.status === 'delivered' ? 'bg-green-500/20 text-green-500' : 'bg-neon-orange/20 text-neon-orange'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm">{order.items.length} Modules Loaded</h4>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div className="font-mono font-bold text-neon-red">${order.total.toFixed(2)}</div>
                  <ChevronRight size={18} className="text-gray-600 group-hover:text-white transition-colors" />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center p-8 glass rounded-3xl text-gray-500 text-sm">
              No flight logs found.
            </div>
          )}
        </div>
      </section>

      {/* Settings & Logout */}
      <div className="space-y-3 pb-10">
        <button className="w-full h-14 glass rounded-2xl flex items-center px-6 gap-4 hover:bg-white/5 transition-colors">
          <Settings className="text-gray-500" size={20} />
          <span className="font-medium flex-1 text-left">Systems Configuration</span>
          <ChevronRight size={18} className="text-gray-700" />
        </button>
        <button 
          onClick={async () => {
            await logout();
            navigate('/auth');
          }}
          className="w-full h-14 glass rounded-2xl flex items-center px-6 gap-4 hover:bg-neon-red/10 group transition-colors"
        >
          <LogOut className="text-gray-500 group-hover:text-neon-red" size={20} />
          <span className="font-medium flex-1 text-left group-hover:text-neon-red">Terminate Session</span>
        </button>
      </div>
    </div>
  );
};
