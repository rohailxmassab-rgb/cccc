import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Plus } from 'lucide-react';

interface Recommendation {
  name: string;
  description: string;
  category: string;
}

interface Props {
  recommendation: Recommendation;
  onAddToCart: () => void;
}

export const RecommendationCard: React.FC<Props> = ({ recommendation, onAddToCart }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/5 border border-white/10 rounded-[32px] p-5 backdrop-blur-sm relative overflow-hidden group shadow-lg hover:border-neon-red/30 transition-colors"
    >
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-neon-red blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
      
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 px-3 py-1 bg-neon-red/10 rounded-full text-[9px] font-black uppercase text-neon-red border border-neon-red/20 tracking-widest">
          <Sparkles size={10} />
          <span>NEURAL PICK</span>
        </div>
      </div>
      
      <h3 className="text-lg font-black font-display uppercase tracking-tight group-hover:text-neon-red transition-colors italic">{recommendation.name}</h3>
      <p className="text-white/40 text-[10px] line-clamp-2 mt-1 mb-4 italic leading-relaxed">{recommendation.description}</p>
      
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{recommendation.category} SPEC</span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onAddToCart}
          className="w-10 h-10 bg-white/10 hover:bg-neon-red text-white rounded-2xl flex items-center justify-center transition-colors border border-white/10"
        >
          <Plus size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
};
