import React, { useState, useMemo } from 'react';
import { Student, Subject, GradeRecord, Level } from '../types';
import { GRADES_PRIMARIA, GRADES_SECUNDARIA } from '../constants';
import { getGradeLabel } from '../services/dataService';
import { User, Search, AlertCircle } from 'lucide-react';

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
    
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 20) return; // Scale 0-20

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
                            const score = gradeRecord ? gradeRecord.score : '';
                            const isPublished = gradeRecord?.isPublished || false;

                            return (
                                <tr key={student.id} className="hover:bg-slate-50/80 transition">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{student.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                min="0" 
                                                max="20"
                                                className={`w-24 pl-3 pr-2 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition font-mono ${
                                                    Number(score) >= 10 ? 'border-green-300 text-green-700 bg-green-50' : 
                                                    score === '' ? 'border-slate-300' : 'border-red-300 text-red-700 bg-red-50'
                                                } ${isPublished ? 'opacity-70 bg-slate-100 cursor-not-allowed' : ''}`}
                                                placeholder="-"
                                                value={score}
                                                onChange={(e) => handleScoreChange(student.id, e.target.value)}
                                                readOnly={isPublished}
                                                title={isPublished ? "Esta nota ya ha sido publicada por Control de Estudios y no se puede editar" : "Editar nota"}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {score !== '' ? (
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
                                        {score !== '' ? (
                                             <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                 Number(score) >= 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                             }`}>
                                                 {Number(score) >= 10 ? 'Aprobado' : 'Reprobado'}
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