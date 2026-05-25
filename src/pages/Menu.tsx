import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Star, Plus } from 'lucide-react';
import { MENU_ITEMS, CATEGORIES } from '../data';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const Menu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const filteredItems = MENU_ITEMS.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="px-6 space-y-6 pt-4 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold font-display neon-text">Commissary</h1>
        <button className="p-3 glass rounded-2xl">
          <Filter size={20} className="text-gray-400" />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input 
          type="text" 
          placeholder="Locate nutrients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 pl-12 pr-4 glass rounded-xl outline-none focus:ring-1 focus:ring-neon-red/50 text-sm"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => setActiveCategory('All')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
            activeCategory === 'All' ? 'bg-white text-black border-white' : 'glass text-gray-500 border-white/10'
          }`}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setActiveCategory(cat.name)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border whitespace-nowrap ${
              activeCategory === cat.name ? 'bg-white text-black border-white' : 'glass text-gray-500 border-white/10'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass rounded-[40px] overflow-hidden flex flex-col border border-white/5 hover:border-neon-red/30 transition-all group cursor-pointer shadow-xl pb-4"
              onClick={() => navigate(`/item/${item.id}`)}
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 flex items-center gap-1 glass px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                  <Star size={10} className="text-neon-red fill-neon-red" />
                  <span>{item.ratings}</span>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black font-mono text-neon-red">
                  ${item.price}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <h3 className="font-black font-display uppercase tracking-tight text-lg italic group-hover:text-neon-red transition-colors leading-tight">{item.name}</h3>
                  <p className="text-white/40 text-[10px] line-clamp-2 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex gap-2">
                    {item.ingredients.slice(0, 2).map((ing, idx) => (
                      <span key={idx} className="text-[8px] bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-white/40 font-black uppercase tracking-widest">
                        {ing}
                      </span>
                    ))}
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item);
                    }}
                    className="w-12 h-12 bg-white/5 text-white/40 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-neon-red group-hover:text-white group-hover:border-neon-red transition-all shadow-lg"
                  >
                    <Plus size={24} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredItems.length === 0 && (
         <div className="text-center py-20 text-gray-500 flex flex-col items-center gap-4">
            <Search size={48} className="opacity-20" />
            <p>No nutrient sources detected in this sector.</p>
         </div>
      )}
    </div>
  );
};
