import React, { useMemo } from 'react';
import { Subject } from '../types';
import { INITIAL_USERS } from '../constants';
import { Users, Book } from 'lucide-react';

interface TeachersViewProps {
  subjects: Subject[];
}

const TeachersView: React.FC<TeachersViewProps> = ({ subjects }) => {
  const teachers = useMemo(() => INITIAL_USERS.filter(u => u.role === 'profesor'), []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Gestión de Profesores</h2>
        <p className="text-slate-400">Listado de profesores y sus materias asignadas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map(teacher => {
          const teacherSubjects = subjects.filter(s => s.teacherId === teacher.id);
          return (
            <div key={teacher.id} className="bg-[#1e293b] p-6 rounded-xl shadow-sm border border-slate-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400">
                    <Users className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-white">{teacher.name}</h3>
                    <p className="text-sm text-slate-400">Profesor</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-300">Materias Asignadas ({teacherSubjects.length}):</p>
                {teacherSubjects.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">Sin materias asignadas</p>
                ) : (
                    <ul className="space-y-1">
                        {teacherSubjects.map(subject => (
                            <li key={subject.id} className="flex items-center gap-2 text-sm text-slate-300 bg-[#0f172a] p-2 rounded-lg">
                                <Book className="w-4 h-4 text-blue-400" />
                                {subject.name} - Grado {subject.grade}
                            </li>
                        ))}
                    </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeachersView;
