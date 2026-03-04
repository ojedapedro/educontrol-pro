import React, { useState, useEffect } from 'react';
import { ViewState, AppState, GradeRecord, Subject, User } from './types';
import { getInitialData, saveDataLocally, fetchFromGoogleSheets, saveToGoogleSheets } from './services/dataService';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import GradeEntry from './components/GradeEntry';
import SubjectManager from './components/SubjectManager';
import Reports from './components/Reports';
import PublishingPanel from './components/PublishingPanel';
import TeachersView from './components/TeachersView';
import Login from './components/Login';
import TopBar from './components/TopBar';
import { Menu, RefreshCw, CloudOff } from 'lucide-react';
import { GOOGLE_SHEETS_API_URL } from './constants';

const App: React.FC = () => {
  // 1. Load Local Data first (Instant UI)
  const [data, setData] = useState<AppState>(() => getInitialData());
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // Loading & Sync States
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(false);

  // State lifted from Reports
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  // Initial Data Fetch from Google Sheets
  useEffect(() => {
    const initData = async () => {
        const isDemo = new URLSearchParams(window.location.search).get('demo') === 'true';
        if (!GOOGLE_SHEETS_API_URL || isDemo) return;
        
        setIsLoading(true);
        const cloudData = await fetchFromGoogleSheets();
        
        if (cloudData) {
            setData(prev => ({
                ...prev,
                students: cloudData.students?.length ? cloudData.students : prev.students,
                subjects: cloudData.subjects?.length ? cloudData.subjects : prev.subjects,
                grades: cloudData.grades || prev.grades
            }));
            setSyncError(false);
        } else {
            setSyncError(true);
        }
        setIsLoading(false);
    };

    initData();
  }, []);

  // Persist data (Local + Cloud Debounced)
  useEffect(() => {
    // Always save local instantly
    saveDataLocally(data);

    // Debounce cloud save (2 seconds) to avoid spamming the sheet
    const isDemo = new URLSearchParams(window.location.search).get('demo') === 'true';
    if (!GOOGLE_SHEETS_API_URL || isDemo) return;

    const timeoutId = setTimeout(() => {
        setIsSyncing(true);
        saveToGoogleSheets(data).finally(() => {
            setIsSyncing(false);
        });
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [data]);

  const handleUpdateGrade = (newGrade: GradeRecord) => {
    setData(prev => {
      const existingIndex = prev.grades.findIndex(
        g => g.studentId === newGrade.studentId && 
             g.subjectId === newGrade.subjectId && 
             g.period === newGrade.period
      );

      let newGrades = [...prev.grades];
      if (existingIndex >= 0) {
        newGrades[existingIndex] = newGrade;
      } else {
        newGrades.push(newGrade);
      }
      return { ...prev, grades: newGrades };
    });
  };

  const handleAddSubject = (subject: Subject) => {
    setData(prev => ({
        ...prev,
        subjects: [...prev.subjects, subject]
    }));
  };

  const handleDeleteSubject = (id: string) => {
    setData(prev => ({
        ...prev,
        subjects: prev.subjects.filter(s => s.id !== id),
        grades: prev.grades.filter(g => g.subjectId !== id)
    }));
  };

  const handleLogin = (user: User) => {
    setData(prev => ({ ...prev, currentUser: user }));
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setData(prev => ({ ...prev, currentUser: null }));
  };

  const handleGlobalSearchSelect = (studentId: string) => {
    setSelectedStudentId(studentId);
    setCurrentView('reports');
  };

  if (!data.currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 transition-transform duration-300 transform lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
            currentView={currentView} 
            onChangeView={(view) => { setCurrentView(view); setSidebarOpen(false); }}
            currentUser={data.currentUser}
            onLogout={handleLogout}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Mobile Header */}
        <div className="lg:hidden bg-[#1e293b] border-b border-slate-700 p-4 flex items-center justify-between">
            <span className="font-bold text-white">EduControPro</span>
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-300 hover:bg-slate-700 rounded">
                <Menu />
            </button>
        </div>

        {/* Global Search Bar (Desktop/Tablet) */}
        <TopBar 
            students={data.students}
            onSelectStudent={handleGlobalSearchSelect}
            currentUser={data.currentUser}
        />

        {/* Sync Status Bar */}
        {(isSyncing || syncError || isLoading) && (
             <div className={`px-8 py-1 text-xs font-medium flex items-center justify-end gap-2 ${
                 syncError ? 'bg-red-900/50 text-red-200' : 'bg-indigo-900/50 text-indigo-200'
             }`}>
                {isLoading && <>Cargando datos de la nube...</>}
                {isSyncing && <><RefreshCw className="w-3 h-3 animate-spin"/> Guardando en Google Sheets...</>}
                {syncError && <><CloudOff className="w-3 h-3"/> Sin conexión a la BD. Trabajando localmente.</>}
             </div>
        )}

        {/* Warning if URL is missing or demo mode is active */}
        {new URLSearchParams(window.location.search).get('demo') === 'true' ? (
            <div className="bg-amber-100 text-amber-800 px-8 py-2 text-xs text-center border-b border-amber-200">
                ⚠️ Modo Demo Local: Trabajando sin conexión a base de datos (solo localStorage).
            </div>
        ) : !GOOGLE_SHEETS_API_URL && !isLoading ? (
            <div className="bg-amber-100 text-amber-800 px-8 py-2 text-xs text-center border-b border-amber-200">
                ⚠️ Modo Demo Local: Configure la URL de la API en <code>constants.ts</code> para conectar con Google Sheets.
            </div>
        ) : null}

        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
           {currentView === 'dashboard' && <Dashboard data={data} />}
           
           {currentView === 'grades' && (
             <GradeEntry 
                students={data.students}
                subjects={data.subjects}
                grades={data.grades}
                onUpdateGrade={handleUpdateGrade}
             />
           )}
           
           {currentView === 'publishing' && (
             <PublishingPanel
                students={data.students}
                subjects={data.subjects}
                grades={data.grades}
                onUpdateGrade={handleUpdateGrade}
             />
           )}
           
           {currentView === 'subjects' && (
             <SubjectManager 
                subjects={data.subjects}
                onAddSubject={handleAddSubject}
                onDeleteSubject={handleDeleteSubject}
             />
           )}
           
           {currentView === 'teachers' && (
             <TeachersView 
                subjects={data.subjects}
             />
           )}
           
           {currentView === 'reports' && (
             <Reports 
                students={data.students}
                subjects={data.subjects}
                grades={data.grades}
                selectedStudentId={selectedStudentId}
                onStudentChange={setSelectedStudentId}
             />
           )}
        </main>
      </div>
    </div>
  );
};

export default App;