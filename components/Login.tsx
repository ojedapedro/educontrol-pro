import React, { useState } from 'react';
import { User } from '../types';
import { INITIAL_USERS } from '../constants';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = INITIAL_USERS.find(u => u.username === username.toLowerCase().trim());
    
    if (user) {
      if (user.password && user.password !== password) {
        setError('Contraseña incorrecta.');
        return;
      }
      onLogin(user);
    } else {
      setError('Usuario no encontrado.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex">
      {/* Left Side: Decoration */}
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-indigo-900/20" />
        
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
        >
            <div className="w-80 h-80 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <img src="https://i.ibb.co/Nnp24NFT/pngtree-boy-going-to-school-clipart-png-image-17881122.png" alt="Estudiante" className="w-48 h-48 object-contain z-10" referrerPolicy="no-referrer" />
            </div>
            
            {/* Floating Cards */}
            <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-12 top-10 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-xl text-white flex items-center gap-2"
            >
                <BookOpen className="w-5 h-5 text-blue-300" /> Ingresos
            </motion.div>
            
            <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-12 bottom-10 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-xl text-white flex items-center gap-2"
            >
                <GraduationCap className="w-5 h-5 text-indigo-300" /> Alumnos
            </motion.div>
        </motion.div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#1e293b]">
        <div className="w-full max-w-md">
            <div className="flex items-center gap-4 mb-8">
                <img src="https://i.ibb.co/FbHJbvVT/images.png" alt="Logo" className="w-16 h-16" />
                <div>
                    <h1 className="text-3xl font-bold text-white">EduControPro</h1>
                    <p className="text-slate-400">Sistema de Gestión Administrativa Escolar</p>
                </div>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Correo Electrónico</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => { setUsername(e.target.value); setError(''); }}
                        className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="usuario@colegio.com"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                        className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="••••••••"
                    />
                </div>

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center text-slate-400">
                        <input type="checkbox" className="mr-2" /> Recordarme
                    </label>
                    <a href="#" className="text-blue-400 hover:underline">¿Olvidó su contraseña?</a>
                </div>

                {error && <div className="p-3 bg-red-900/50 text-red-200 text-sm rounded-lg">{error}</div>}

                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition">
                    Iniciar Sesión
                </button>
                <button type="button" className="w-full bg-slate-700 text-white py-3 rounded-xl font-medium hover:bg-slate-600 transition">
                    Modo Demo
                </button>
            </form>
            
            <p className="text-center text-slate-500 text-xs mt-8">v1.2 | AdminPro School Management</p>
        </div>
      </div>
    </div>
  );
};

export default Login;