import React, { useState, useMemo } from 'react';
import { Student, Subject, GradeRecord, Level } from '../types';
import { GRADES_PRIMARIA, GRADES_SECUNDARIA } from '../constants';
import { getGradeLabel } from '../services/dataService';
import { CheckCircle, Eye, Search, Filter, ShieldCheck, MessageSquare, X, Save } from 'lucide-react';

interface PublishingPanelProps {
  students: Student[];
  subjects: Subject[];
  grades: GradeRecord[];
  onUpdateGrade: (grade: GradeRecord) => void;
}

const PublishingPanel: React.FC<PublishingPanelProps> = ({ students, subjects, grades, onUpdateGrade }) => {
  const [level, setLevel] = useState<Level>('primaria');
  const [gradeYear, setGradeYear] = useState<number>(1);
  const [subjectId, setSubjectId] = useState<string>('all');
  const [period, setPeriod] = useState<number>(1);
  
  // State for Comment Modal
  const [editingCommentGradeId, setEditingCommentGradeId] = useState<string | null>(null);
  const [tempComment, setTempComment] = useState('');

  // Filter Subjects
  const availableSubjects = useMemo(() => 
    subjects.filter(s => s.level === level && s.grade === gradeYear),
  [subjects, level, gradeYear]);

  // Main Filter Logic
  const filteredRecords = useMemo(() => {
    // 1. Get Students in this level/grade
    const targetStudents = students.filter(s => s.level === level && s.grade === gradeYear);
    
    // 2. Map data for the table
    const records: Array<{
        student: Student;
        gradeRec: GradeRecord | undefined;
        subject: Subject;
    }> = [];

    targetStudents.forEach(student => {
        const studentSubjects = subjectId === 'all' 
            ? availableSubjects 
            : availableSubjects.filter(s => s.id === subjectId);

        studentSubjects.forEach(subject => {
            const gradeRec = grades.find(g => 
                g.studentId === student.id && 
                g.subjectId === subject.id && 
                g.period === period
            );
            
            // Only show if a grade exists (we can't publish a non-existent grade)
            if (gradeRec) {
                records.push({ student, gradeRec, subject });
            }
        });
    });

    return records;
  }, [students, grades, level, gradeYear, subjectId, period, availableSubjects]);

  const handleTogglePublish = (gradeRec: GradeRecord) => {
    onUpdateGrade({
        ...gradeRec,
        isPublished: !gradeRec.isPublished
    });
  };

  const handlePublishAll = () => {
    filteredRecords.forEach(rec => {
        if (!rec.gradeRec?.isPublished && rec.gradeRec) {
            onUpdateGrade({
                ...rec.gradeRec,
                isPublished: true
            });
        }
    });
  };

  const openCommentModal = (gradeRec: GradeRecord) => {
    setEditingCommentGradeId(gradeRec.id);
    setTempComment(gradeRec.comment || '');
  };

  const saveComment = () => {
    if (!editingCommentGradeId) return;
    
    // Find the full record to update
    const record = grades.find(g => g.id === editingCommentGradeId);
    if (record) {
        onUpdateGrade({
            ...record,
            comment: tempComment
        });
    }
    setEditingCommentGradeId(null);
    setTempComment('');
  };

  // Statistics
  const totalShown = filteredRecords.length;
  const publishedCount = filteredRecords.filter(r => r.gradeRec?.isPublished).length;
  const pendingCount = totalShown - publishedCount;

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
               <ShieldCheck className="w-8 h-8 text-indigo-600" />
               Panel de Control de Estudios
           </h2>
           <p className="text-slate-500">Gestión de publicación y visibilidad de calificaciones.</p>
        </div>
        <div className="text-right">
            <div className="text-sm font-medium text-slate-600">Estado Actual de la Vista</div>
            <div className="flex gap-4 mt-1">
                <span className="text-green-600 font-bold">{publishedCount} Publicadas</span>
                <span className="text-amber-600 font-bold">{pendingCount} Pendientes</span>
            </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-4 text-slate-700 font-medium">
            <Filter className="w-4 h-4" />
            Filtros de Búsqueda
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select 
                className="p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                value={level}
                onChange={(e) => { setLevel(e.target.value as Level); setGradeYear(1); setSubjectId('all'); }}
            >
                <option value="primaria">Primaria</option>
                <option value="secundaria">Secundaria</option>
            </select>
            <select 
                className="p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                value={gradeYear}
                onChange={(e) => { setGradeYear(Number(e.target.value)); setSubjectId('all'); }}
            >
                {(level === 'primaria' ? GRADES_PRIMARIA : GRADES_SECUNDARIA).map(g => (
                    <option key={g} value={g}>{getGradeLabel(level, g)}</option>
                ))}
            </select>
            <select 
                className="p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
            >
                <option value="all">Todas las Materias</option>
                {availableSubjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                ))}
            </select>
             <div className="flex bg-slate-100 rounded-lg p-1">
                {[1, 2, 3].map((l) => (
                    <button
                        key={l}
                        onClick={() => setPeriod(l)}
                        className={`flex-1 py-1 text-sm font-medium rounded transition ${period === l ? 'bg-white shadow text-indigo-700' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Lapso {l}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-lg border border-indigo-100">
          <p className="text-indigo-800 text-sm">
             <span className="font-bold">{filteredRecords.length}</span> registros encontrados con los filtros actuales.
          </p>
          <button 
            onClick={handlePublishAll}
            disabled={pendingCount === 0}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2"
          >
              <CheckCircle className="w-4 h-4" />
              Publicar Todos los Pendientes
          </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         {filteredRecords.length === 0 ? (
             <div className="p-12 text-center text-slate-400">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-20"/>
                <p>No hay registros de calificaciones para estos filtros.</p>
             </div>
         ) : (
             <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                     <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-xs">
                         <tr>
                             <th className="px-6 py-4">Estudiante</th>
                             <th className="px-6 py-4">Materia</th>
                             <th className="px-6 py-4">Nota</th>
                             <th className="px-6 py-4">Observaciones</th>
                             <th className="px-6 py-4 text-center">Estado</th>
                             <th className="px-6 py-4 text-right">Acción</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                         {filteredRecords.map((item, idx) => (
                             <tr key={`${item.student.id}-${item.subject.id}`} className="hover:bg-slate-50">
                                 <td className="px-6 py-4 font-medium text-slate-700">{item.student.name}</td>
                                 <td className="px-6 py-4 text-slate-600">{item.subject.name}</td>
                                 <td className="px-6 py-4 font-mono font-bold text-slate-800">{item.gradeRec?.score}</td>
                                 <td className="px-6 py-4">
                                     <button 
                                        onClick={() => item.gradeRec && openCommentModal(item.gradeRec)}
                                        className={`flex items-center gap-2 max-w-[150px] truncate text-xs px-2 py-1 rounded transition ${
                                            item.gradeRec?.comment 
                                            ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                                            : 'text-slate-400 hover:text-slate-600 border border-transparent hover:border-slate-200'
                                        }`}
                                     >
                                        <MessageSquare className="w-3 h-3 flex-shrink-0" />
                                        <span className="truncate">
                                            {item.gradeRec?.comment ? item.gradeRec.comment : 'Agregar nota...'}
                                        </span>
                                     </button>
                                 </td>
                                 <td className="px-6 py-4 text-center">
                                     {item.gradeRec?.isPublished ? (
                                         <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                             <Eye className="w-3 h-3" /> Publicado
                                         </span>
                                     ) : (
                                         <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold">
                                             Oculto
                                         </span>
                                     )}
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                     <button
                                        onClick={() => item.gradeRec && handleTogglePublish(item.gradeRec)}
                                        className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                                            item.gradeRec?.isPublished 
                                            ? 'text-red-600 bg-red-50 hover:bg-red-100 border border-red-200'
                                            : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200'
                                        }`}
                                     >
                                         {item.gradeRec?.isPublished ? 'Ocultar' : 'Publicar'}
                                     </button>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
         )}
      </div>

      {/* Comment Edit Modal */}
      {editingCommentGradeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-indigo-500" />
                        Observación Académica
                    </h3>
                    <button onClick={() => setEditingCommentGradeId(null)} className="text-slate-400 hover:text-slate-600 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">
                    <p className="text-sm text-slate-500 mb-3">
                        Agregue un comentario interno o una nota para el boletín sobre esta calificación.
                    </p>
                    <textarea 
                        autoFocus
                        className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-slate-700"
                        placeholder="Ej: Calificación corregida tras revisión..."
                        value={tempComment}
                        onChange={(e) => setTempComment(e.target.value)}
                    />
                </div>
                <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3">
                    <button 
                        onClick={() => setEditingCommentGradeId(null)}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={saveComment}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Guardar Comentario
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default PublishingPanel;