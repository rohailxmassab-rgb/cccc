import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Flame, Star, ChevronRight, Sparkles } from 'lucide-react';
import { CATEGORIES, MENU_ITEMS } from '../data';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { RecommendationCard } from '../components/RecommendationCard';

export const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Burgers');
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingAI, setLoadingAI] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch('/api/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userPreferences: 'Likes futuristic burgers and spicy food' })
        });
        const data = await res.json();
        setRecommendations(data.recommendations || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAI(false);
      }
    };
    fetchRecommendations();
  }, []);

  const filteredItems = MENU_ITEMS.filter(item => 
    item.category === activeCategory && 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-6 space-y-8">
      {/* Search Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group mt-4"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-red transition-colors" />
        <input 
          type="text" 
          placeholder="Search futuristic meals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-14 pl-12 pr-4 glass rounded-2xl outline-none focus:ring-2 focus:ring-neon-red/50 transition-all text-gray-200 placeholder:text-gray-600"
        />
      </motion.div>

      {/* Hero Carousel (Netflix Style) */}
      <section className="relative overflow-hidden rounded-[40px] h-[320px] group border border-white/5">
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent z-10"
        />
        <img src={MENU_ITEMS[0].image} alt="Featured" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 flex flex-col justify-center p-10 z-20">
          <span className="bg-neon-red text-white text-[10px] font-black px-3 py-1 rounded-full w-fit mb-4 tracking-widest uppercase">Featured Masterpiece</span>
          <h2 className="text-5xl font-black mb-4 leading-tight font-display uppercase tracking-tighter italic">THE CYBER<br/>BURGER</h2>
          <div className="flex items-center gap-6 mt-2">
            <button 
              onClick={() => navigate(`/item/${MENU_ITEMS[0].id}`)}
              className="bg-white text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-[0_10px_20px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 transition-all"
            >
              Order Now
            </button>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-light font-mono">${MENU_ITEMS[0].price}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="space-y-4">
        <div className="flex justify-between items-end px-2">
          <h2 className="text-xl font-bold font-display uppercase tracking-tight">Categories</h2>
          <button className="text-neon-red text-xs font-black uppercase tracking-widest">See All</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {CATEGORIES.map((cat, idx) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
                activeCategory === cat.name 
                ? 'bg-neon-red/10 text-neon-red border-neon-red shadow-[0_0_15px_rgba(255,77,0,0.2)]' 
                : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
              }`}
            >
              {cat.name}
            </motion.button>
          ))}
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-neon-orange w-5 h-5" />
          <h2 className="text-xl font-bold font-display uppercase tracking-tight italic">Neural Picks</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingAI ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-44 glass rounded-[32px] animate-pulse" />
            ))
          ) : (
            recommendations.map((rec, idx) => (
              <RecommendationCard 
                key={idx}
                recommendation={rec} 
                onAddToCart={() => addToCart({ ...MENU_ITEMS[0], ...rec, id: `ai-${idx}`, price: 19.99, image: MENU_ITEMS[0].image })} 
              />
            ))
          )}
        </div>
      </section>

      {/* Popular Items */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Flame className="text-neon-orange w-5 h-5" />
          <h2 className="text-xl font-bold font-display uppercase tracking-tight italic">Trending Now</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-[32px] p-4 space-y-4 group cursor-pointer relative overflow-hidden border border-white/5 hover:border-neon-red/30 transition-all shadow-xl"
              onClick={() => navigate(`/item/${item.id}`)}
            >
              <div className="relative aspect-square rounded-[24px] overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-3 right-3 glass p-2 rounded-full">
                  <Star className="w-3 h-3 text-neon-red fill-neon-red" />
                </div>
              </div>
              <div className="px-1">
                <h3 className="font-black font-display uppercase tracking-tight text-sm italic truncate">{item.name}</h3>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-neon-red font-black font-mono text-sm">${item.price}</span>
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item);
                    }}
                    className="w-10 h-10 bg-white/5 text-white/40 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-neon-red hover:text-white transition-colors"
                  >
                    <ChevronRight size={18} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
