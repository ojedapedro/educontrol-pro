import React, { useState, useMemo, useEffect } from 'react';
import { Student, Subject, GradeRecord, Level } from '../types';
import { GRADES_PRIMARIA, GRADES_SECUNDARIA, SECTIONS_LIST } from '../constants';
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
  const [section, setSection] = useState<string>('A');
  const [subjectId, setSubjectId] = useState<string>('');
  const [period, setPeriod] = useState<1 | 2 | 3>(1);

  // Local state to track inputs while typing allows us to show invalid states
  const [localInputs, setLocalInputs] = useState<Record<string, string>>({});

  // Reset local inputs when context changes
  useEffect(() => {
    setLocalInputs({});
  }, [level, gradeYear, section, subjectId, period]);

  // Filter students based on selection (Level, Grade, Section)
  const filteredStudents = useMemo(() => 
    students.filter(s => 
        s.level === level && 
        s.grade === gradeYear && 
        s.section === section
    ),
  [students, level, gradeYear, section]);

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

    setLocalInputs(prev => ({ ...prev, [studentId]: value }));
    
    if (value === '') return;
    
    const numValue = parseFloat(value);
    const isValid = !isNaN(numValue) && numValue >= 0 && numValue <= 20;

    if (isValid) {
        const existingGrade = grades.find(
          g => g.studentId === studentId && g.subjectId === subjectId && g.period === period
        );

        const newGrade: GradeRecord = {
          id: existingGrade ? existingGrade.id : Math.random().toString(36),
          studentId,
          subjectId,
          score: numValue,
          period,
          isPublished: existingGrade ? existingGrade.isPublished : false
        };

        onUpdateGrade(newGrade);
    }
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
           <h2 className="text-2xl font-bold text-white">Carga de Notas</h2>
           <p className="text-slate-400">Registre las calificaciones. Estas quedarán pendientes de publicación por Control de Estudios.</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#1e293b] p-4 rounded-xl shadow-sm border border-slate-700 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Nivel</label>
          <select 
            className="w-full p-2 bg-[#0f172a] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            value={level}
            onChange={(e) => { setLevel(e.target.value as Level); setGradeYear(1); }}
          >
            <option value="primaria">Primaria</option>
            <option value="secundaria">Secundaria</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Grado / Año</label>
          <select 
            className="w-full p-2 bg-[#0f172a] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            value={gradeYear}
            onChange={(e) => setGradeYear(Number(e.target.value))}
          >
            {(level === 'primaria' ? GRADES_PRIMARIA : GRADES_SECUNDARIA).map(g => (
                <option key={g} value={g}>{getGradeLabel(level, g)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Sección</label>
          <select 
            className="w-full p-2 bg-[#0f172a] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            value={section}
            onChange={(e) => setSection(e.target.value)}
          >
            {SECTIONS_LIST.map(s => (
                <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Materia</label>
          <select 
            className="w-full p-2 bg-[#0f172a] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
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
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Lapso</label>
          <div className="flex bg-[#0f172a] rounded-lg p-1 border border-slate-700">
            {[1, 2, 3].map((l) => (
                <button
                    key={l}
                    onClick={() => setPeriod(l as 1|2|3)}
                    className={`flex-1 py-1.5 text-sm font-medium rounded transition ${period === l ? 'bg-[#1e293b] shadow text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    {l}º
                </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grade Table */}
      <div className="bg-[#1e293b] rounded-xl shadow-sm border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700 bg-[#1e293b] flex justify-between items-center">
            <h3 className="font-semibold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500"/>
                Lista de Estudiantes - Sección "{section}"
            </h3>
            <span className="text-sm text-slate-400">
                {filteredStudents.length} Estudiante(s)
            </span>
        </div>
        
        {filteredStudents.length === 0 ? (
             <div className="p-12 text-center text-slate-400">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-20"/>
                <p>No se encontraron estudiantes para este grado y sección.</p>
             </div>
        ) : filteredSubjects.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
                <p>No hay materias registradas. Agrega materias primero.</p>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#0f172a] border-b border-slate-700">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Nombre del Estudiante</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider w-48">Calificación (0-20)</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Estado de Publicación</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Estado Académico</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {filteredStudents.map(student => {
                            const gradeRecord = getStudentGrade(student.id);
                            
                            const inputValue = localInputs[student.id] !== undefined 
                                ? localInputs[student.id] 
                                : (gradeRecord ? String(gradeRecord.score) : '');
                                
                            const isPublished = gradeRecord?.isPublished || false;
                            
                            const numVal = parseFloat(inputValue);
                            const isValid = inputValue === '' || (!isNaN(numVal) && numVal >= 0 && numVal <= 20);
                            
                            let inputClasses = "w-24 pl-3 pr-2 py-2 border rounded-lg focus:ring-2 focus:outline-none transition font-mono bg-[#0f172a] ";
                            
                            if (!isValid) {
                                inputClasses += "border-red-500 ring-2 ring-red-900/50 text-red-200";
                            } else if (isPublished) {
                                inputClasses += "border-slate-700 opacity-70 bg-[#1e293b] cursor-not-allowed text-slate-400";
                            } else if (numVal >= 10) {
                                inputClasses += "border-green-700 text-green-300 focus:ring-green-900/50 focus:border-green-500";
                            } else if (inputValue !== '') {
                                inputClasses += "border-red-700 text-red-300 focus:ring-red-900/50 focus:border-red-500";
                            } else {
                                inputClasses += "border-slate-700 text-white focus:ring-blue-500 focus:border-blue-500";
                            }

                            return (
                                <tr key={student.id} className="hover:bg-[#2d3748]/30 transition">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-200">
                                        {student.name}
                                        <span className="ml-2 text-xs text-slate-500 bg-[#0f172a] px-1.5 py-0.5 rounded">
                                            Sec. {student.section}
                                        </span>
                                    </td>
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
                                                <div className="absolute left-0 -bottom-5 text-[10px] text-red-400 font-bold flex items-center gap-1">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    Inválido (0-20)
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {gradeRecord ? (
                                            isPublished ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-200">
                                                    Publicada
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-900/50 text-amber-200">
                                                    Borrador (No visible)
                                                </span>
                                            )
                                        ) : (
                                            <span className="text-slate-500 text-xs italic">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {inputValue !== '' && isValid ? (
                                             <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                 Number(inputValue) >= 10 ? 'bg-green-900/50 text-green-200' : 'bg-red-900/50 text-red-200'
                                             }`}>
                                                 {Number(inputValue) >= 10 ? 'Aprobado' : 'Reprobado'}
                                             </span>
                                        ) : (
                                            <span className="text-slate-500 text-xs italic">Pendiente</span>
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
      <div className="flex items-start gap-2 text-xs text-amber-300 bg-amber-900/20 p-3 rounded-lg border border-amber-900/50">
        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <p>Nota: Las calificaciones marcadas como "Publicada" no pueden ser modificadas en esta pantalla. Contacte a Control de Estudios para correcciones.</p>
      </div>
    </div>
  );
};

export default GradeEntry;