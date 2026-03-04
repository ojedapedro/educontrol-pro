import React from 'react';
import { AppState } from '../types';
import { Users, BookOpen, GraduationCap, TrendingUp } from 'lucide-react';

interface DashboardProps {
    data: AppState;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const totalStudents = data.students.length;
  const totalSubjects = data.subjects.length;
  const currentUser = data.currentUser;
  
  // Calculate a mock "Global Average" just for display
  const totalGrades = data.grades.length;
  const averageScore = totalGrades > 0 
    ? (data.grades.reduce((acc, curr) => acc + curr.score, 0) / totalGrades).toFixed(1)
    : "0.0";

  const stats = [
    { label: 'Estudiantes', value: totalStudents, icon: Users, color: 'bg-blue-500' },
    { label: 'Materias Activas', value: totalSubjects, icon: BookOpen, color: 'bg-emerald-500' },
    { label: 'Registros de Notas', value: totalGrades, icon: GraduationCap, color: 'bg-indigo-500' },
    { label: 'Promedio Global', value: averageScore, icon: TrendingUp, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">
            Bienvenido, {currentUser?.role === 'superintendente' ? 'Superintendente' : currentUser?.name}
        </h2>
        <p className="text-slate-400 mt-1">
            {currentUser?.role === 'superintendente' 
                ? 'Vista general de supervisión académica. Modo de Solo Lectura.' 
                : 'Resumen general del periodo escolar 2024-2025'
            }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
                <div key={idx} className="bg-[#1e293b] p-6 rounded-xl shadow-sm border border-slate-700 hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.color} bg-opacity-20`}>
                            <Icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                        </div>
                    </div>
                </div>
            );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-[#1e293b] p-6 rounded-xl shadow-sm border border-slate-700">
            <h3 className="font-bold text-lg text-white mb-4">Niveles Educativos</h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#0f172a] rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 font-bold">P</div>
                        <div>
                            <h4 className="font-semibold text-white">Primaria</h4>
                            <p className="text-xs text-slate-400">1º a 6º Grado</p>
                        </div>
                    </div>
                    <span className="font-medium text-slate-300">
                        {data.students.filter(s => s.level === 'primaria').length} Estudiantes
                    </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#0f172a] rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 font-bold">S</div>
                        <div>
                            <h4 className="font-semibold text-white">Secundaria</h4>
                            <p className="text-xs text-slate-400">1º a 5º Año</p>
                        </div>
                    </div>
                    <span className="font-medium text-slate-300">
                        {data.students.filter(s => s.level === 'secundaria').length} Estudiantes
                    </span>
                </div>
            </div>
         </div>

         <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-sm text-white border border-slate-700">
            <h3 className="font-bold text-lg mb-2">Próximos Eventos</h3>
            <p className="text-slate-400 text-sm mb-6">Calendario académico del mes en curso.</p>
            
            <div className="space-y-3">
                <div className="flex gap-4 items-start">
                    <div className="bg-white/5 px-3 py-2 rounded text-center min-w-[60px]">
                        <span className="block text-xs uppercase text-slate-400">OCT</span>
                        <span className="block text-xl font-bold">15</span>
                    </div>
                    <div>
                        <h4 className="font-medium">Cierre del Lapso 1</h4>
                        <p className="text-xs text-slate-400">Fecha límite para carga de notas de primaria.</p>
                    </div>
                </div>
                 <div className="flex gap-4 items-start">
                    <div className="bg-white/5 px-3 py-2 rounded text-center min-w-[60px]">
                        <span className="block text-xs uppercase text-slate-400">OCT</span>
                        <span className="block text-xl font-bold">22</span>
                    </div>
                    <div>
                        <h4 className="font-medium">Consejo Docente</h4>
                        <p className="text-xs text-slate-400">Revisión de rendimiento académico Secundaria.</p>
                    </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;