import React, { useState } from 'react';
import { Subject, Level } from '../types';
import { GRADES_PRIMARIA, GRADES_SECUNDARIA } from '../constants';
import { getGradeLabel } from '../services/dataService';
import { Plus, Trash2, Book } from 'lucide-react';

interface SubjectManagerProps {
  subjects: Subject[];
  onAddSubject: (subject: Subject) => void;
  onDeleteSubject: (id: string) => void;
}

const SubjectManager: React.FC<SubjectManagerProps> = ({ subjects, onAddSubject, onDeleteSubject }) => {
  const [newSubjectName, setNewSubjectName] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<Level>('primaria');
  const [selectedGrade, setSelectedGrade] = useState<number>(1);

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

  // Filter subjects for display based on current selection to make it cleaner
  const filteredSubjects = subjects.filter(
    s => s.level === selectedLevel && s.grade === selectedGrade
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Gestión de Materias</h2>
           <p className="text-slate-500">Administra el pensum académico por nivel y grado.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Panel */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-fit">
          <h3 className="text-lg font-semibold mb-4 text-slate-700 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-600" />
            Nueva Materia
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de la Materia</label>
              <input
                type="text"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="Ej. Matemáticas Avanzadas"
                className="w-full rounded-lg border-slate-300 border p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nivel Académico</label>
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => { setSelectedLevel('primaria'); setSelectedGrade(1); }}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition ${selectedLevel === 'primaria' ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Primaria
                </button>
                <button
                  onClick={() => { setSelectedLevel('secundaria'); setSelectedGrade(1); }}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition ${selectedLevel === 'secundaria' ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Secundaria
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Grado / Año</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(Number(e.target.value))}
                className="w-full rounded-lg border-slate-300 border p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {(selectedLevel === 'primaria' ? GRADES_PRIMARIA : GRADES_SECUNDARIA).map(g => (
                  <option key={g} value={g}>{getGradeLabel(selectedLevel, g)}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAdd}
              disabled={!newSubjectName.trim()}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Agregar Materia
            </button>
          </div>
        </div>

        {/* List Panel */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
             <h3 className="text-lg font-semibold text-slate-700">
                Materias Existentes
             </h3>
             <span className="text-sm px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full font-medium">
                {getGradeLabel(selectedLevel, selectedGrade)}
             </span>
          </div>

          {filteredSubjects.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Book className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No hay materias registradas para este grado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredSubjects.map(subject => (
                <div key={subject.id} className="group flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Book className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-slate-700">{subject.name}</span>
                  </div>
                  <button
                    onClick={() => onDeleteSubject(subject.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition opacity-0 group-hover:opacity-100"
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