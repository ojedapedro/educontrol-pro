import React, { useState } from 'react';
import { Student, Subject, GradeRecord, Level } from '../types';
import { GRADES_PRIMARIA, GRADES_SECUNDARIA } from '../constants';
import { getGradeLabel } from '../services/dataService';
import { generateStudentReport } from '../services/geminiService';
import { FileText, Sparkles, Printer, Download, BarChart3 } from 'lucide-react';

interface ReportsProps {
  students: Student[];
  subjects: Subject[];
  grades: GradeRecord[];
  selectedStudentId: string;
  onStudentChange: (id: string) => void;
}

const Reports: React.FC<ReportsProps> = ({ 
    students, 
    subjects, 
    grades, 
    selectedStudentId, 
    onStudentChange 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  // Derivations
  const selectedStudent = students.find(s => s.id === selectedStudentId);
  
  // Filter grades for AI context - strictly published only
  const studentGrades = selectedStudentId 
    ? grades.filter(g => g.studentId === selectedStudentId && g.isPublished)
    : [];

  const studentSubjects = selectedStudent 
    ? subjects.filter(s => s.level === selectedStudent.level && s.grade === selectedStudent.grade)
    : [];

  const handleGenerateAIReport = async () => {
    if (!selectedStudent) return;
    setIsGenerating(true);
    setAiReport(null);
    try {
        const report = await generateStudentReport(
            selectedStudent.name,
            selectedStudent.level,
            selectedStudent.grade,
            studentGrades, // AI only sees published grades
            subjects
        );
        setAiReport(report);
    } catch (e) {
        console.error(e);
    } finally {
        setIsGenerating(false);
    }
  };

  // Calculate averages per subject
  const reportCardData = studentSubjects.map(subject => {
    const lapso1Rec = grades.find(g => g.studentId === selectedStudentId && g.subjectId === subject.id && g.period === 1);
    const lapso2Rec = grades.find(g => g.studentId === selectedStudentId && g.subjectId === subject.id && g.period === 2);
    const lapso3Rec = grades.find(g => g.studentId === selectedStudentId && g.subjectId === subject.id && g.period === 3);

    // STRICT: Only use values if published. If not published, it's null (treated as non-existent).
    const lapso1 = (lapso1Rec && lapso1Rec.isPublished) ? lapso1Rec.score : null;
    const lapso2 = (lapso2Rec && lapso2Rec.isPublished) ? lapso2Rec.score : null;
    const lapso3 = (lapso3Rec && lapso3Rec.isPublished) ? lapso3Rec.score : null;
    
    const scores = [lapso1, lapso2, lapso3].filter(s => s !== null) as number[];
    const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const max = scores.length > 0 ? Math.max(...scores) : 0;
    const min = scores.length > 0 ? Math.min(...scores) : 0;

    return {
        subjectName: subject.name,
        lapso1: lapso1 !== null ? lapso1 : '-',
        lapso2: lapso2 !== null ? lapso2 : '-',
        lapso3: lapso3 !== null ? lapso3 : '-',
        definitiva: scores.length === 3 ? avg.toFixed(1) : '-',
        // Stats for summary
        hasData: scores.length > 0,
        avgValue: avg,
        maxValue: max,
        minValue: min
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Boletines Informativos</h2>
           <p className="text-slate-500">Vista previa del boletín oficial. Solo muestra notas publicadas.</p>
        </div>
        
        <div className="w-full md:w-auto">
            <select
                className="w-full md:w-80 p-2.5 bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                value={selectedStudentId}
                onChange={(e) => { onStudentChange(e.target.value); setAiReport(null); }}
            >
                <option value="">Seleccione un estudiante...</option>
                {students.map(s => (
                    <option key={s.id} value={s.id}>
                        {s.name} - {getGradeLabel(s.level, s.grade)} "{s.section}" ({s.level})
                    </option>
                ))}
            </select>
        </div>
      </div>

      {!selectedStudent ? (
        <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-12 flex flex-col items-center justify-center text-slate-400">
            <FileText className="w-16 h-16 mb-4 opacity-50"/>
            <p className="text-lg font-medium">Selecciona un estudiante para ver su boletín</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Boletin Card */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 bg-indigo-600 text-white flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-bold">{selectedStudent.name}</h3>
                            <p className="text-indigo-100 mt-1">
                                Boletín Informativo - {getGradeLabel(selectedStudent.level, selectedStudent.grade)} Sección "{selectedStudent.section}"
                            </p>
                        </div>
                        <div className="bg-white/10 p-2 rounded-lg">
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-100">Año Escolar</span>
                            <div className="text-lg font-mono font-semibold">2024-2025</div>
                        </div>
                    </div>

                    <div className="p-0">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Materia</th>
                                    <th className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase">Lapso 1</th>
                                    <th className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase">Lapso 2</th>
                                    <th className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase">Lapso 3</th>
                                    <th className="px-4 py-4 text-center text-xs font-bold text-slate-800 uppercase bg-slate-100">Def.</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {reportCardData.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-sm font-medium text-slate-700">{row.subjectName}</td>
                                        <td className="px-4 py-4 text-center text-slate-600 font-mono">
                                            {row.lapso1}
                                        </td>
                                        <td className="px-4 py-4 text-center text-slate-600 font-mono">
                                            {row.lapso2}
                                        </td>
                                        <td className="px-4 py-4 text-center text-slate-600 font-mono">
                                            {row.lapso3}
                                        </td>
                                        <td className="px-4 py-4 text-center font-bold text-slate-900 bg-slate-50 font-mono">{row.definitiva}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 items-center">
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition">
                                <Printer className="w-4 h-4" />
                                Imprimir
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition">
                                <Download className="w-4 h-4" />
                                PDF
                            </button>
                        </div>
                    </div>
                </div>

                {/* Statistical Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-indigo-500" />
                        <h4 className="font-semibold text-slate-700">Resumen Estadístico por Materia</h4>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 uppercase">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium">Materia</th>
                                    <th className="px-4 py-3 text-center font-medium">Promedio</th>
                                    <th className="px-4 py-3 text-center font-medium text-green-600">Alta</th>
                                    <th className="px-4 py-3 text-center font-medium text-red-600">Baja</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {reportCardData.filter(d => d.hasData).length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-6 text-center text-slate-400 italic">
                                            No hay suficientes datos publicados para generar estadísticas.
                                        </td>
                                    </tr>
                                ) : (
                                    reportCardData.filter(d => d.hasData).map((row, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50">
                                            <td className="px-6 py-3 text-slate-700">{row.subjectName}</td>
                                            <td className="px-4 py-3 text-center font-mono font-medium">{row.avgValue.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-center font-mono text-green-700 bg-green-50">{row.maxValue}</td>
                                            <td className="px-4 py-3 text-center font-mono text-red-700 bg-red-50">{row.minValue}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* AI Insight Card */}
            <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                            <h3 className="font-bold text-lg">Análisis Pedagógico AI</h3>
                        </div>
                        
                        {!aiReport ? (
                             <div className="space-y-4">
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    Genera un reporte cualitativo basado en las notas <strong>publicadas</strong>.
                                </p>
                                <button 
                                    onClick={handleGenerateAIReport}
                                    disabled={isGenerating}
                                    className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isGenerating ? (
                                        <>Analizando...</> 
                                    ) : (
                                        <>Generar Análisis</>
                                    )}
                                </button>
                             </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 bg-white/10 rounded-lg border border-white/5 text-sm leading-relaxed text-indigo-100 italic">
                                    "{aiReport}"
                                </div>
                                <button 
                                    onClick={() => setAiReport(null)}
                                    className="text-xs text-slate-400 hover:text-white underline"
                                >
                                    Generar nuevo
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {/* Decorators */}
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
                    <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h4 className="font-semibold text-slate-800 mb-3">Estadísticas Rápidas</h4>
                    <div className="space-y-3">
                         <div className="flex justify-between items-center text-sm">
                             <span className="text-slate-500">Promedio General</span>
                             <span className="font-bold text-slate-800">
                                {(() => {
                                    const scores = studentGrades.map(g => g.score);
                                    if (!scores.length) return "N/A";
                                    return (scores.reduce((a,b)=>a+b,0) / scores.length).toFixed(2);
                                })()} pts
                             </span>
                         </div>
                         <div className="flex justify-between items-center text-sm">
                             <span className="text-slate-500">Asistencia</span>
                             <span className="font-bold text-slate-800">96%</span>
                         </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Reports;