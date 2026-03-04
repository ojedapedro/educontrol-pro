import React, { useState } from 'react';
import { User } from '../types';
import { INITIAL_USERS } from '../constants';

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
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-12 relative">
        <img src="https://i.ibb.co/FbHJbvVT/images.png" alt="Logo" className="w-24 h-24 mb-12" />
        <div className="relative">
            <div className="w-80 h-80 bg-blue-500 rounded-3xl flex items-center justify-center">
                {/* Placeholder for 3D illustration */}
                <span className="text-white text-6xl">👤</span>
            </div>
            {/* Floating Cards */}
            <div className="absolute -left-12 top-10 bg-white p-4 rounded-xl shadow-lg">Ingresos</div>
            <div className="absolute -right-12 bottom-10 bg-white p-4 rounded-xl shadow-lg">Alumnos</div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#1e293b]">
        <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-white mb-2">EduControPro</h1>
            <p className="text-slate-400 mb-8">Sistema de Gestión Administrativa Escolar</p>
            
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