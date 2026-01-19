import React, { useState, useMemo, useEffect } from 'react';
import { Student, Subject, GradeRecord, Level } from '../types';
import { GRADES_PRIMARIA, GRADES_SECUNDARIA } from '../constants';
import { getGradeLabel } from '../services/dataService';
import { User, Search, AlertCircle, AlertTriangle } from 'lucide-react';

interface GradeEntryProps {
  students: Student[];
  subjects: Subject[];
  grades: GradeRecord[];
  onUpdateGrade: (grade: GradeRecord) => void;
}

const GradeEntry: React.FC<GradeEntryProps> = ({ students, subjects, grades, onUpdateGrade }) => {
  const [level, setLevel] = useState<Level>('primaria');
  const [gradeYear, setGradeYear] = useState<number>(1);
  const [subjectId, setSubjectId] = useState<string>('');
  const [period, setPeriod] = useState<1 | 2 | 3>(1);

  // Local state to track inputs while typing allows us to show invalid states
  // without committing them to the global store immediately if they are wrong.
  const [localInputs, setLocalInputs] = useState<Record<string, string>>({});

  // Reset local inputs when context changes to avoid stale data visibility
  useEffect(() => {
    setLocalInputs({});
  }, [level, gradeYear, subjectId, period]);

  // Filter students based on selection
  const filteredStudents = useMemo(() => 
    students.filter(s => s.level === level && s.grade === gradeYear),
  [students, level, gradeYear]);

  // Filter subjects based on selection
  const filteredSubjects = useMemo(() => 
    subjects.filter(s => s.level === level && s.grade === gradeYear),
  [subjects, level, gradeYear]);

  // Set initial subject if available
  React.useEffect(() => {
    if (filteredSubjects.length > 0 && !filteredSubjects.find(s => s.id === subjectId)) {
      setSubjectId(filteredSubjects[0].id);
    } else if (filteredSubjects.length === 0) {
        setSubjectId('');
    }
  }, [filteredSubjects, subjectId]);

  const handleScoreChange = (studentId: string, value: string) => {
    if (!subjectId) return;

    // 1. Update local UI state immediately so the user sees what they type
    setLocalInputs(prev => ({ ...prev, [studentId]: value }));
    
    // 2. Allow clearing the grade
    if (value === '') {
        // Find existing to preserve ID if needed, though for deletion/clearing we might handle differently.
        // For now, we update it to 0 or we could add a logic to remove it. 
        // Here we won't trigger update on empty string to avoid "0" popping up, 
        // or we could save a special value. Let's assume empty string doesn't save/delete yet 
        // OR we interpret empty as "remove grade". For safety, let's just return and keep it local.
        return; 
    }
    
    const numValue = parseFloat(value);
    
    // 3. Validation Logic
    const isValid = !isNaN(numValue) && numValue >= 0 && numValue <= 20;

    // 4. Only Save to Global Store if Valid
    if (isValid) {
        // Find existing grade record
        const existingGrade = grades.find(
          g => g.studentId === studentId && g.subjectId === subjectId && g.period === period
        );

        const newGrade: GradeRecord = {
          id: existingGrade ? existingGrade.id : Math.random().toString(36),
          studentId,
          subjectId,
          score: numValue,
          period,
          // If it exists, keep publish status, otherwise default to false (draft)
          isPublished: existingGrade ? existingGrade.isPublished : false
        };

        onUpdateGrade(newGrade);
    }
    // If invalid, we do nothing (the localInputs state keeps the bad value visible and red)
  };

  const getStudentGrade = (studentId: string) => {
    return grades.find(
      g => g.studentId === studentId && g.subjectId === subjectId && g.period === period
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Carga de Notas</h2>
           <p className="text-slate-500">Registre las calificaciones. Estas quedarán pendientes de publicación por Control de Estudios.</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Nivel</label>
          <select 
            className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:border-indigo-500"
            value={level}
            onChange={(e) => { setLevel(e.target.value as Level); setGradeYear(1); }}
          >
            <option value="primaria">Primaria</option>
            <option value="secundaria">Secundaria</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Grado / Año</label>
          <select 
            className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:border-indigo-500"
            value={gradeYear}
            onChange={(e) => setGradeYear(Number(e.target.value))}
          >
            {(level === 'primaria' ? GRADES_PRIMARIA : GRADES_SECUNDARIA).map(g => (
                <option key={g} value={g}>{getGradeLabel(level, g)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Materia</label>
          <select 
            className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:border-indigo-500"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            disabled={filteredSubjects.length === 0}
          >
            {filteredSubjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
            ))}
            {filteredSubjects.length === 0 && <option>Sin materias</option>}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Lapso</label>
          <div className="flex bg-slate-100 rounded-lg p-1">
            {[1, 2, 3].map((l) => (
                <button
                    key={l}
                    onClick={() => setPeriod(l as 1|2|3)}
                    className={`flex-1 py-1.5 text-sm font-medium rounded transition ${period === l ? 'bg-white shadow text-indigo-700' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    {l}º
                </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grade Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-500"/>
                Lista de Estudiantes
            </h3>
            <span className="text-sm text-slate-500">
                {filteredStudents.length} Estudiante(s)
            </span>
        </div>
        
        {filteredStudents.length === 0 ? (
             <div className="p-12 text-center text-slate-400">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-20"/>
                <p>No se encontraron estudiantes para este grado.</p>
             </div>
        ) : filteredSubjects.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
                <p>No hay materias registradas. Agrega materias primero.</p>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nombre del Estudiante</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-48">Calificación (0-20)</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado de Publicación</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado Académico</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredStudents.map(student => {
                            const gradeRecord = getStudentGrade(student.id);
                            
                            // Determine the value to show: Local typing state > Saved state > Empty
                            const inputValue = localInputs[student.id] !== undefined 
                                ? localInputs[student.id] 
                                : (gradeRecord ? String(gradeRecord.score) : '');
                                
                            const isPublished = gradeRecord?.isPublished || false;
                            
                            // Validation Check for Styling
                            const numVal = parseFloat(inputValue);
                            const isValid = inputValue === '' || (!isNaN(numVal) && numVal >= 0 && numVal <= 20);
                            
                            // Determine styles based on value and validity
                            let inputClasses = "w-24 pl-3 pr-2 py-2 border rounded-lg focus:ring-2 focus:outline-none transition font-mono ";
                            
                            if (!isValid) {
                                inputClasses += "border-red-500 ring-2 ring-red-100 bg-red-50 text-red-900";
                            } else if (isPublished) {
                                inputClasses += "border-slate-300 opacity-70 bg-slate-100 cursor-not-allowed";
                            } else if (numVal >= 10) {
                                inputClasses += "border-green-300 text-green-700 bg-green-50 focus:ring-green-200 focus:border-green-500";
                            } else if (inputValue !== '') {
                                inputClasses += "border-red-300 text-red-700 bg-red-50 focus:ring-red-200 focus:border-red-500";
                            } else {
                                inputClasses += "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500";
                            }

                            return (
                                <tr key={student.id} className="hover:bg-slate-50/80 transition">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{student.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                className={inputClasses}
                                                placeholder="-"
                                                value={inputValue}
                                                onChange={(e) => handleScoreChange(student.id, e.target.value)}
                                                readOnly={isPublished}
                                                title={!isValid ? "El valor debe estar entre 0 y 20" : isPublished ? "Nota publicada, no editable" : "Ingresar nota 0-20"}
                                            />
                                            {!isValid && (
                                                <div className="absolute left-0 -bottom-5 text-[10px] text-red-600 font-bold flex items-center gap-1">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    Inválido (0-20)
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {gradeRecord ? (
                                            isPublished ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    Publicada
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                    Borrador (No visible)
                                                </span>
                                            )
                                        ) : (
                                            <span className="text-slate-400 text-xs italic">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {inputValue !== '' && isValid ? (
                                             <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                 Number(inputValue) >= 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                             }`}>
                                                 {Number(inputValue) >= 10 ? 'Aprobado' : 'Reprobado'}
                                             </span>
                                        ) : (
                                            <span className="text-slate-400 text-xs italic">Pendiente</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        )}
      </div>
      <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <p>Nota: Las calificaciones marcadas como "Publicada" no pueden ser modificadas en esta pantalla. Contacte a Control de Estudios para correcciones.</p>
      </div>
    </div>
  );
};

export default GradeEntry;