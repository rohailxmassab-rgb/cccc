import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Package, Utensils, TrendingUp, CheckCircle2, Clock, Truck, XCircle, Plus, Trash2, Edit2, LayoutDashboard, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order, OrderStatus, MenuItem } from '../types';
import { MENU_ITEMS as initialItems } from '../data';

export const Admin: React.FC = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // For adding new item
  const [showItemModal, setShowItemModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=800',
    ingredients: [],
    ratings: 4.5
  });

  useEffect(() => {
    if (!isAdmin) return;

    const ordersQ = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
    const unsubscribeOrders = onSnapshot(ordersQ, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
      setLoading(false);
    });

    // In a real app, menu would also be in Firestore. 
    // We'll simulate fetching from a 'menu' collection, 
    // and if empty, we could seed it (omitted for brevity, just using local state + firestore sync if implemented)
    const menuQ = query(collection(db, 'menu'));
    const unsubscribeMenu = onSnapshot(menuQ, (snapshot) => {
       if (snapshot.empty) {
         setMenuItems(initialItems);
       } else {
         setMenuItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem)));
       }
    });

    return () => {
      unsubscribeOrders();
      unsubscribeMenu();
    };
  }, [isAdmin]);

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddItem = async () => {
    try {
      await addDoc(collection(db, 'menu'), { ...newItem, id: Date.now().toString() });
      setShowItemModal(false);
      setNewItem({ name: '', description: '', price: 0, category: 'Burgers', image: newItem.image, ingredients: [], ratings: 4.5 });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Erase this item from the database?')) return;
    try {
      await deleteDoc(doc(db, 'menu', id));
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading) return null;
  if (!isAdmin) return <Navigate to="/" />;

  const statusIcons: Record<string, any> = {
    pending: <Clock className="text-yellow-500" size={16} />,
    confirmed: <CheckCircle2 className="text-blue-500" size={16} />,
    preparing: <Utensils className="text-neon-orange" size={16} />,
    out_for_delivery: <Truck className="text-purple-500" size={16} />,
    delivered: <CheckCircle2 className="text-green-500" size={16} />,
    cancelled: <XCircle className="text-red-500" size={16} />,
  };

  return (
    <div className="px-6 space-y-8 pt-4 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-display tracking-tighter italic uppercase">
            OVERLORD <span className="text-neon-red">CONSOLE</span>
          </h1>
          <p className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-black">Restricted Sector - Realtime Bio-Supply Control</p>
        </div>

        <div className="flex glass p-1.5 rounded-2xl border-white/5">
           <button 
             onClick={() => setActiveTab('orders')}
             className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-neon-red text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
           >
             <LayoutDashboard size={16} />
             <span>Missions</span>
           </button>
           <button 
             onClick={() => setActiveTab('menu')}
             className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'menu' ? 'bg-neon-red text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
           >
             <Settings size={16} />
             <span>Arsenal</span>
           </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<TrendingUp className="text-neon-red" />} 
          label="Total Revenue" 
          value={`$${orders.reduce((acc, o) => acc + o.total, 0).toFixed(0)}`}
          color="neon-red"
        />
        <StatCard 
          icon={<Package className="text-neon-orange" />} 
          label="Active Missions" 
          value={orders.length.toString()}
          color="neon-orange"
        />
        <StatCard 
          icon={<Utensils className="text-blue-400" />} 
          label="Menu Assets" 
          value={menuItems.length.toString()}
          color="blue-400"
        />
         <StatCard 
          icon={<CheckCircle2 className="text-green-400" />} 
          label="Successful Linkages" 
          value={orders.filter(o => o.status === 'delivered').length.toString()}
          color="green-400"
        />
      </div>

      {activeTab === 'orders' ? (
        <section className="space-y-6">
          <h3 className="font-black font-display text-xl uppercase tracking-tight italic">Mission Intelligence</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {orders.map((order) => (
              <motion.div 
                key={order.id}
                layout
                className="glass p-6 rounded-[32px] border border-white/5 space-y-6 shadow-xl relative overflow-hidden"
              >
                <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-2">
                     <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black font-mono text-white/20 uppercase tracking-widest">UNIT: {order.id?.slice(-8).toUpperCase()}</span>
                       <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full text-[9px] uppercase font-black tracking-widest border border-white/10">
                          {statusIcons[order.status]}
                          <span>{order.status}</span>
                       </div>
                     </div>
                     <h4 className="font-black font-display uppercase tracking-tight text-xl italic">{order.customerName}</h4>
                     <p className="text-xs text-neon-red font-black font-mono tracking-widest uppercase">{order.phone}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-2xl font-black font-mono text-neon-red italic">${order.total.toFixed(2)}</p>
                     <p className="text-[9px] text-white/20 uppercase tracking-widest font-black">Link established</p>
                  </div>
                </div>

                <div className="bg-white/[0.03] p-4 rounded-2xl text-[11px] space-y-2 border border-white/5">
                   <p className="text-white/40 leading-relaxed"><b className="text-white text-[10px] uppercase font-black tracking-widest block mb-1">Vector Coordinates:</b> {order.address}</p>
                   <p className="text-white/40 leading-relaxed"><b className="text-white text-[10px] uppercase font-black tracking-widest block mb-1 mt-1">Payload Specs:</b> {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</p>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                   {['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map(status => (
                     <button 
                       key={status}
                       onClick={() => updateOrderStatus(order.id!, status as OrderStatus)}
                       className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${
                         order.status === status ? 'bg-neon-red text-white border-neon-red shadow-lg' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
                       }`}
                     >
                       {status.replace(/_/g, ' ')}
                     </button>
                   ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      ) : (
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-black font-display text-xl uppercase tracking-tight italic">Arsenal Inventory</h3>
            <button 
              onClick={() => setShowItemModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-neon-red hover:bg-[#FF2E00] text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg"
            >
              <Plus size={18} />
              <span>Forge Asset</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <div key={item.id} className="glass rounded-[32px] overflow-hidden border border-white/5 group shadow-xl">
                <div className="aspect-video relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                  <div className="absolute bottom-4 left-4">
                     <span className="text-[10px] font-black uppercase tracking-widest text-neon-red bg-neon-red/10 px-2 py-1 rounded border border-neon-red/20">{item.category}</span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-black font-display uppercase tracking-tight text-lg italic truncate">{item.name}</h4>
                    <span className="font-mono font-black text-neon-red">${item.price}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 p-3 glass rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all">
                      <Edit2 size={16} className="mx-auto" />
                    </button>
                    <button 
                      onClick={() => handleDeleteItem(item.id)}
                      className="flex-1 p-3 glass rounded-xl text-white/40 hover:text-neon-red hover:bg-neon-red/10 transition-all"
                    >
                      <Trash2 size={16} className="mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Basic Modal for Adding Item */}
      {showItemModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowItemModal(false)} />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass w-full max-w-lg rounded-[40px] p-10 border border-white/10 relative z-10 space-y-8 shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
          >
             <h2 className="text-3xl font-black font-display uppercase tracking-tight italic">Forge New <span className="text-neon-red">Asset</span></h2>
             
             <div className="space-y-5">
                <div className="space-y-2">
                   <label className="text-[10px] uppercase font-black tracking-widest text-white/40 px-1">Asset Name</label>
                   <input 
                     type="text" 
                     value={newItem.name} 
                     onChange={e => setNewItem({...newItem, name: e.target.value})}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold focus:border-neon-red outline-none transition-colors"
                     placeholder="Unit Designation..."
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/40 px-1">Credits</label>
                    <input 
                      type="number" 
                      value={newItem.price} 
                      onChange={e => setNewItem({...newItem, price: parseFloat(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold focus:border-neon-red outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/40 px-1">Classification</label>
                    <select 
                      value={newItem.category} 
                      onChange={e => setNewItem({...newItem, category: e.target.value as any})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold focus:border-neon-red outline-none transition-colors appearance-none"
                    >
                      <option className="bg-matte-black">Burgers</option>
                      <option className="bg-matte-black">Pizza</option>
                      <option className="bg-matte-black">BBQ</option>
                      <option className="bg-matte-black">Drinks</option>
                      <option className="bg-matte-black">Desserts</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] uppercase font-black tracking-widest text-white/40 px-1">Intelligence Report</label>
                   <textarea 
                     value={newItem.description} 
                     onChange={e => setNewItem({...newItem, description: e.target.value})}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold focus:border-neon-red outline-none transition-colors h-24 resize-none"
                     placeholder="Describe the biochemical impact..."
                   />
                </div>
             </div>

             <div className="flex gap-4">
                <button 
                  onClick={() => setShowItemModal(false)}
                  className="flex-1 py-4 rounded-2xl border border-white/10 text-white/40 font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
                >
                  Abort
                </button>
                <button 
                  onClick={handleAddItem}
                  className="flex-1 py-4 rounded-2xl bg-neon-red text-white font-black uppercase tracking-widest text-xs hover:bg-[#FF2E00] shadow-lg transition-all"
                >
                  Initiate Forge
                </button>
             </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, color: string }> = ({ icon, label, value }) => (
  <div className="glass p-8 rounded-[32px] space-y-4 border border-white/5 shadow-lg relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-24 h-24 bg-current opacity-[0.03] blur-2xl group-hover:opacity-[0.06] transition-opacity pointer-events-none" />
    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
      {React.cloneElement(icon as React.ReactElement, { size: 24 })}
    </div>
    <div className="space-y-1">
      <span className="text-3xl font-black font-mono italic tracking-tighter">{value}</span>
      <span className="text-[10px] text-white/20 uppercase font-black tracking-[0.2em] block">{label}</span>
    </div>
  </div>
);
