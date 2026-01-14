import React, { useState, useEffect, useRef } from 'react';
import { Search, User, X } from 'lucide-react';
import { Student } from '../types';
import { getGradeLabel } from '../services/dataService';

interface TopBarProps {
  students: Student[];
  onSelectStudent: (studentId: string) => void;
  currentUser: { name: string; role: string } | null;
}

const TopBar: React.FC<TopBarProps> = ({ students, onSelectStudent, currentUser }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const filteredStudents = query.length > 0 
    ? students.filter(s => s.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleSelect = (id: string) => {
    onSelectStudent(id);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="bg-white border-b border-slate-200 px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-20 shadow-sm">
      
      {/* Search Bar */}
      <div className="relative w-full md:w-96" ref={wrapperRef}>
        <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar estudiante..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-transparent focus:bg-white border focus:border-indigo-500 rounded-lg outline-none transition text-sm"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
              onFocus={() => setIsOpen(true)}
            />
            {query && (
                <button 
                    onClick={() => { setQuery(''); setIsOpen(false); }}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>

        {/* Dropdown Results */}
        {isOpen && query.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 max-h-80 overflow-y-auto z-50">
                {filteredStudents.length === 0 ? (
                    <div className="p-4 text-center text-slate-500 text-sm">
                        No se encontraron estudiantes.
                    </div>
                ) : (
                    <div className="py-2">
                        <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Resultados</div>
                        {filteredStudents.map(student => (
                            <button
                                key={student.id}
                                onClick={() => handleSelect(student.id)}
                                className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 transition"
                            >
                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                    {student.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-slate-800">{student.name}</div>
                                    <div className="text-xs text-slate-500">
                                        {getGradeLabel(student.level, student.grade)} • {student.level}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        )}
      </div>

      {/* User Profile Snippet (Desktop) */}
      <div className="hidden md:flex items-center gap-3">
         <div className="text-right">
            <div className="text-sm font-bold text-slate-800">{currentUser?.name}</div>
            <div className="text-xs text-slate-500 capitalize">{currentUser?.role.replace('_', ' ')}</div>
         </div>
         <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
            <User className="h-6 w-6" />
         </div>
      </div>
    </div>
  );
};

export default TopBar;