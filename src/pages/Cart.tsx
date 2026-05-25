import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, Minus, CreditCard, Send, Package, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export const Cart: React.FC = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    phone: '',
    address: '',
    notes: ''
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        userId: user?.uid || 'guest',
        items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        total: totalPrice + 5, // $5 delivery
        status: 'pending',
        customerName: formData.name,
        phone: formData.phone,
        address: formData.address,
        notes: formData.notes,
        timestamp: serverTimestamp()
      };

      // 1. Save to Firebase
      await addDoc(collection(db, 'orders'), orderData);

      // 2. WhatsApp Deep Link
      const whatsappNumber = '923200592219';
      const orderDetails = items.map(i => `${i.name} x${i.quantity}`).join('\n');
      const message = encodeURIComponent(`*ALFLIX NEW ORDER*\n\n*Customer:* ${formData.name}\n*Phone:* ${formData.phone}\n*Address:* ${formData.address}\n\n*Items:*\n${orderDetails}\n\n*Total:* $${(totalPrice + 5).toFixed(2)}\n*Notes:* ${formData.notes || 'None'}`);
      
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${message}`;

      // 3. Success Feedback
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF4D00', '#FF8C00', '#ffffff']
      });

      // Standard window.open with location.href fallback
      const win = window.open(whatsappUrl, '_blank');
      if (!win) {
        window.location.href = whatsappUrl;
      }

      clearCart();
      setIsCheckingOut(false);
      
      // Reset after tiny delay
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error(error);
      alert('Order failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-6 pt-24">
        <motion.div 
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="p-8 bg-white/5 rounded-full"
        >
          <Package size={64} className="text-gray-500" />
        </motion.div>
        <div className="text-center">
          <h2 className="text-2xl font-bold font-display">Empty Hangar</h2>
          <p className="text-gray-500 mt-2">No meals scheduled for delivery.</p>
        </div>
        <button onClick={() => navigate('/menu')} className="btn-premium">Browse Fleet</button>
      </div>
    );
  }

  return (
    <div className="px-6 space-y-8 pt-4 pb-20 max-w-5xl mx-auto">
      <h1 className="text-3xl font-black font-display uppercase tracking-tight italic">
        Your <span className="text-neon-red">Cargo</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Items List */}
        <div className="lg:col-span-7 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                className="glass p-5 rounded-[32px] flex gap-6 items-center border border-white/5 hover:border-white/10 transition-colors shadow-lg"
              >
                <div className="w-24 h-24 rounded-[20px] overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-black font-display uppercase tracking-tight text-sm italic">{item.name}</h3>
                  <p className="text-neon-red font-mono font-bold text-sm">${item.price}</p>
                  
                  <div className="flex items-center gap-4 mt-3">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)} 
                      className="w-8 h-8 flex items-center justify-center glass rounded-xl hover:bg-white/10 text-white/40"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-black font-mono w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)} 
                      className="w-8 h-8 flex items-center justify-center glass rounded-xl hover:bg-white/10 text-white/40"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)} 
                  className="w-10 h-10 flex items-center justify-center text-white/20 hover:text-neon-red transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary & Checkout Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass p-8 rounded-[40px] space-y-6 border border-neon-red/10 sticky top-24">
            <h2 className="text-xl font-black font-display uppercase tracking-tight italic">Analysis</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-xs uppercase tracking-widest font-black">
                <span className="text-white/20">Subtotal</span>
                <span className="font-mono text-white/60">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs uppercase tracking-widest font-black">
                <span className="text-white/20">Quantum Delivery</span>
                <span className="font-mono text-white/60">$5.00</span>
              </div>
              <div className="h-[1px] bg-white/5" />
              <div className="flex justify-between font-black text-2xl uppercase tracking-tighter italic pt-2">
                <span>Total</span>
                <span className="text-neon-red font-mono">${(totalPrice + 5).toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={() => setIsCheckingOut(true)} 
              className="btn-premium w-full flex items-center justify-center gap-3 h-16 shadow-[0_20px_40px_rgba(255,77,0,0.3)]"
            >
              <CreditCard size={20} />
              <span>Initialize Checkout</span>
            </button>
            <p className="text-[9px] text-center text-white/20 uppercase tracking-[0.2em] font-black">Secure Neural Link Established</p>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-matte-black w-full max-w-md glass rounded-t-[40px] sm:rounded-3xl p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold font-display">Target Location</h2>
                <button onClick={() => setIsCheckingOut(false)} className="text-gray-500 hover:text-white">Close</button>
              </div>

              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase font-bold tracking-widest">Receiver Name</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    type="text" className="w-full h-12 glass rounded-xl px-4 outline-none focus:ring-1 focus:ring-neon-red" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase font-bold tracking-widest">Comm ID (Phone)</label>
                  <input 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    type="tel" className="w-full h-12 glass rounded-xl px-4 outline-none focus:ring-1 focus:ring-neon-red" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase font-bold tracking-widest">Vector Coords (Address)</label>
                  <textarea 
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full h-24 glass rounded-xl p-4 outline-none focus:ring-1 focus:ring-neon-red resize-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase font-bold tracking-widest">Special Transmission (Notes)</label>
                  <input 
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    type="text" className="w-full h-12 glass rounded-xl px-4 outline-none focus:ring-1 focus:ring-neon-red" 
                  />
                </div>

                <button 
                  disabled={loading}
                  type="submit" 
                  className={`btn-premium w-full mt-4 flex items-center justify-center gap-2 h-14 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Transmitting...' : (
                    <>
                      <Send size={18} />
                      <span>Transmit Order to WhatsApp</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
