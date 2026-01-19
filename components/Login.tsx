import React, { useState } from 'react';
import { User } from '../types';
import { INITIAL_USERS } from '../constants';
import { ArrowRight, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock authentication based on predefined users
    const user = INITIAL_USERS.find(u => u.username === username.toLowerCase().trim());
    
    if (user) {
      onLogin(user);
    } else {
      setError('Usuario no encontrado. Intente: admin, profesor, control o super');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md flex flex-col">
        <div className="p-8 bg-indigo-600 text-white text-center">
            <div className="inline-flex p-3 bg-white/20 rounded-full mb-4">
                <img 
                    src="https://i.ibb.co/FbHJbvVT/images.png" 
                    alt="EduControl Logo" 
                    className="w-16 h-16 rounded-full object-cover bg-white"
                />
            </div>
            <h1 className="text-2xl font-bold">EduControl</h1>
            <p className="text-indigo-200 text-sm mt-1">Gestión Académica Integral</p>
        </div>
        
        <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Usuario</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => { setUsername(e.target.value); setError(''); }}
                            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            placeholder="Ingrese su usuario"
                            autoFocus
                        />
                        <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition flex items-center justify-center gap-2"
                >
                    Ingresar al Sistema
                    <ArrowRight className="w-4 h-4" />
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-xs text-center text-slate-400 mb-3">Usuarios de demostración disponibles:</p>
                <div className="flex flex-wrap justify-center gap-2 text-xs">
                    <button onClick={() => setUsername('admin')} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 font-mono">admin</button>
                    <button onClick={() => setUsername('profesor')} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 font-mono">profesor</button>
                    <button onClick={() => setUsername('control')} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 font-mono">control</button>
                    <button onClick={() => setUsername('super')} className="px-3 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded text-amber-700 font-mono">super</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;