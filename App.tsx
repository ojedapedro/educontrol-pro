import React, { useState, useEffect } from 'react';
import { ViewState, AppState, GradeRecord, Subject, User } from './types';
import { getInitialData, saveData } from './services/dataService';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import GradeEntry from './components/GradeEntry';
import SubjectManager from './components/SubjectManager';
import Reports from './components/Reports';
import PublishingPanel from './components/PublishingPanel';
import Login from './components/Login';
import TopBar from './components/TopBar';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<AppState>(getInitialData());
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // State lifted from Reports to App to support Global Search
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  // Persist data
  useEffect(() => {
    saveData(data);
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
    <div className="min-h-screen bg-slate-50 flex">
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
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
            <span className="font-bold text-slate-800">EduControl</span>
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded">
                <Menu />
            </button>
        </div>

        {/* Global Search Bar (Desktop/Tablet) */}
        <TopBar 
            students={data.students}
            onSelectStudent={handleGlobalSearchSelect}
            currentUser={data.currentUser}
        />

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