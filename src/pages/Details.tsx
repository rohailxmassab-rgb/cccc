import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Star, Clock, Minus, Plus, ShoppingCart } from 'lucide-react';
import { MENU_ITEMS } from '../data';
import { useCart } from '../context/CartContext';

export const Details: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const item = MENU_ITEMS.find((i) => i.id === id);
  const [quantity, setQuantity] = useState(1);

  if (!item) return <div className="p-10 text-center">Item not found</div>;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Image */}
      <div className="relative h-[45vh] overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-0"
        >
          <motion.img 
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-transparent to-black/30" />
        </motion.div>

        <div className="absolute top-6 left-6 z-10 w-full pr-12 flex justify-between">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="p-3 glass rounded-2xl"
          >
            <ChevronLeft />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 glass rounded-2xl"
          >
            <Star className="text-yellow-400" />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 glass -mt-12 rounded-t-[40px] p-8 space-y-6 z-10">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold font-display">{item.name}</h1>
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span>{item.ratings} (1.2k Reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>15-20 min</span>
              </div>
            </div>
          </div>
          <div className="text-2xl font-bold text-neon-red font-mono">${item.price}</div>
        </div>

        <p className="text-gray-400 leading-relaxed text-sm">
          {item.description}
        </p>

        {/* Ingredients */}
        <div className="space-y-3">
          <h3 className="font-bold font-display">Bio-Ingredients</h3>
          <div className="flex flex-wrap gap-2">
            {item.ingredients.map((ing, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="px-4 py-2 bg-white/5 rounded-full text-xs font-medium border border-white/10"
              >
                {ing}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Quantity and Actions */}
        <div className="flex items-center justify-between pt-6 mt-auto">
          <div className="flex items-center gap-4 glass p-2 rounded-2xl border-white/20">
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl hover:bg-neon-red/20 transition-colors"
            >
              <Minus size={18} />
            </motion.button>
            <span className="text-xl font-bold w-6 text-center">{quantity}</span>
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => setQuantity(q => q + 1)}
              className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl hover:bg-neon-red/20 transition-colors"
            >
              <Plus size={18} />
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              for(let i=0; i<quantity; i++) addToCart(item);
              navigate('/cart');
            }}
            className="btn-premium flex-1 ml-6 flex items-center justify-center gap-2"
          >
            <ShoppingCart size={20} />
            <span>Add to Cart</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
