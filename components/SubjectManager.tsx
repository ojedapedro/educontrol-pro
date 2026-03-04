import React, { useState, useMemo } from 'react';
import { Subject, Level } from '../types';
import { GRADES_PRIMARIA, GRADES_SECUNDARIA } from '../constants';
import { getGradeLabel } from '../services/dataService';
import { Plus, Trash2, Book, Search } from 'lucide-react';

interface SubjectManagerProps {
  subjects: Subject[];
  onAddSubject: (subject: Subject) => void;
  onDeleteSubject: (id: string) => void;
}

const SubjectManager: React.FC<SubjectManagerProps> = ({ subjects, onAddSubject, onDeleteSubject }) => {
  const [newSubjectName, setNewSubjectName] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<Level>('primaria');
  const [selectedGrade, setSelectedGrade] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAdd = () => {
    if (!newSubjectName.trim()) return;

    const newSubject: Subject = {
      id: Math.random().toString(36).substring(2, 9),
      name: newSubjectName,
      level: selectedLevel,
      grade: selectedGrade,
    };

    onAddSubject(newSubject);
    setNewSubjectName('');
  };

  const filteredSubjects = useMemo(() => {
    return subjects.filter(
      s => s.level === selectedLevel && 
           s.grade === selectedGrade &&
           s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [subjects, selectedLevel, selectedGrade, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-white">Gestión de Materias</h2>
           <p className="text-slate-400">Administra el pensum académico por nivel y grado.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Panel */}
        <div className="bg-[#1e293b] p-6 rounded-xl shadow-sm border border-slate-700 h-fit">
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-500" />
            Nueva Materia
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Nombre de la Materia</label>
              <input
                type="text"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="Ej. Matemáticas Avanzadas"
                className="w-full rounded-lg bg-[#0f172a] border-slate-700 border p-2 focus:ring-2 focus:ring-blue-500 outline-none transition text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Nivel Académico</label>
              <div className="flex bg-[#0f172a] rounded-lg p-1 border border-slate-700">
                <button
                  onClick={() => { setSelectedLevel('primaria'); setSelectedGrade(1); }}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition ${selectedLevel === 'primaria' ? 'bg-[#1e293b] shadow text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Primaria
                </button>
                <button
                  onClick={() => { setSelectedLevel('secundaria'); setSelectedGrade(1); }}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition ${selectedLevel === 'secundaria' ? 'bg-[#1e293b] shadow text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Secundaria
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Grado / Año</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(Number(e.target.value))}
                className="w-full rounded-lg bg-[#0f172a] border-slate-700 border p-2 focus:ring-2 focus:ring-blue-500 outline-none text-white"
              >
                {(selectedLevel === 'primaria' ? GRADES_PRIMARIA : GRADES_SECUNDARIA).map(g => (
                  <option key={g} value={g}>{getGradeLabel(selectedLevel, g)}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAdd}
              disabled={!newSubjectName.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Agregar Materia
            </button>
          </div>
        </div>

        {/* List Panel */}
        <div className="lg:col-span-2 bg-[#1e293b] p-6 rounded-xl shadow-sm border border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 pb-4 border-b border-slate-700 gap-4">
             <h3 className="text-lg font-semibold text-white">
                Materias Existentes
             </h3>
             <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Buscar materia..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#0f172a] border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
             </div>
          </div>

          {filteredSubjects.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Book className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No hay materias registradas para este grado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSubjects.map(subject => (
                <div key={subject.id} className="bg-[#0f172a] p-4 rounded-xl border border-slate-700 hover:border-blue-500 transition flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400">
                        <Book className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-medium text-slate-200">{subject.name}</p>
                        <p className="text-xs text-slate-500">{getGradeLabel(subject.level, subject.grade)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteSubject(subject.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-full transition opacity-0 group-hover:opacity-100"
                    title="Eliminar materia"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectManager;