import React from 'react';
import { LayoutDashboard, GraduationCap, BookOpen, FileText, CheckCircle, LogOut, Users, User as UserIcon } from 'lucide-react';
import { ViewState, User, Role } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  currentUser: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, currentUser, onLogout }) => {
  
  const getMenuItems = (role: Role) => {
    const items = [
        { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    ];

    if (role === 'profesor' || role === 'admin') {
        items.push({ id: 'grades', label: 'Cargar Notas', icon: GraduationCap });
    }

    if (role === 'control_estudios' || role === 'admin') {
        items.push({ id: 'publishing', label: 'Publicar Notas', icon: CheckCircle });
        items.push({ id: 'subjects', label: 'Gestión Materias', icon: BookOpen });
        items.push({ id: 'teachers', label: 'Profesores', icon: Users });
        items.push({ id: 'students', label: 'Estudiantes', icon: UserIcon });
    }

    // Everyone can see reports, but views might differ internally
    items.push({ id: 'reports', label: 'Boletines', icon: FileText });

    return items;
  };

  const menuItems = getMenuItems(currentUser.role);

  return (
    <div className="w-64 bg-[#1e293b] text-white min-h-screen flex flex-col fixed left-0 top-0 z-10">
      <div className="p-6 flex items-center gap-3 border-b border-slate-700">
        <img 
            src="https://i.ibb.co/FbHJbvVT/images.png" 
            alt="EduControl Logo" 
            className="w-10 h-10 rounded-lg object-cover bg-white"
        />
        <div>
          <h1 className="text-xl font-bold tracking-tight">EduControPro</h1>
          <p className="text-xs text-slate-400 truncate w-32">{currentUser.name}</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as ViewState)}
              title={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-800">
        <button 
            onClick={onLogout}
            title="Cerrar Sesión"
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
        >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;