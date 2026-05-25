import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, LogIn, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginWithGoogle } from '../lib/firebase';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-8 pt-12 space-y-12">
      <div className="space-y-4 text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 glass rounded-3xl mx-auto flex items-center justify-center text-neon-red"
        >
          <User size={40} />
        </motion.div>
        <h1 className="text-4xl font-extrabold font-display">
          {isLogin ? 'Access Portal' : 'Citizen Registry'}
        </h1>
        <p className="text-gray-500 text-sm">Join the futuristic dining revolution</p>
      </div>

      <div className="space-y-6 flex-1">
        <div className="space-y-4">
          {!isLogin && (
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-red transition-colors" size={20} />
              <input type="text" placeholder="Full Name" className="w-full h-14 pl-12 glass rounded-2xl outline-none border border-white/5 focus:border-neon-red/50" />
            </div>
          )}
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-red transition-colors" size={20} />
            <input type="email" placeholder="Email Address" className="w-full h-14 pl-12 glass rounded-2xl outline-none border border-white/5 focus:border-neon-red/50" />
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-red transition-colors" size={20} />
            <input type="password" placeholder="Secure Password" className="w-full h-14 pl-12 glass rounded-2xl outline-none border border-white/5 focus:border-neon-red/50" />
          </div>
        </div>

        <button className="btn-premium w-full h-14 text-lg font-bold flex items-center justify-center gap-2">
          {isLogin ? <LogIn size={20} /> : <User size={20} />}
          <span>{isLogin ? 'Login to ALFLIX' : 'Register Citizen'}</span>
        </button>

        <div className="flex items-center gap-4 py-2">
          <div className="flex-1 h-[1px] bg-white/10" />
          <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">OR</span>
          <div className="flex-1 h-[1px] bg-white/10" />
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full h-14 glass rounded-2xl flex items-center justify-center gap-4 hover:bg-white/10 transition-colors border border-white/5"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100" />
          <span className="font-bold">Continue with Google</span>
        </button>

        <button 
          onClick={() => navigate('/')}
          className="w-full h-14 flex items-center justify-center gap-2 text-gray-500 hover:text-white transition-colors"
        >
          <span>Continue as Guest</span>
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="text-center pt-8">
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm font-medium"
        >
          {isLogin ? "Don't have an ID? " : "Already a Citizen? "}
          <span className="text-neon-red font-bold">
            {isLogin ? 'Get Registered' : 'Access Portal'}
          </span>
        </button>
      </div>
    </div>
  );
};
