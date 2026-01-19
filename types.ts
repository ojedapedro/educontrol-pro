
export type Level = 'primaria' | 'secundaria';
export type Role = 'admin' | 'profesor' | 'control_estudios' | 'superintendente';

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
}

export interface Subject {
  id: string;
  name: string;
  level: Level;
  grade: number; // 1-6 for Primaria, 1-5 for Secundaria
}

export interface Student {
  id: string;
  name: string;
  level: Level;
  grade: number;
  section: string; // New field: 'A', 'B', 'C', etc.
}

export interface GradeRecord {
  id: string;
  studentId: string;
  subjectId: string;
  score: number;
  period: 1 | 2 | 3; // Lapsos
  isPublished: boolean; // New field for Control de Estudios
  comment?: string; // Optional comment for Control de Estudios
}

export interface AppState {
  students: Student[];
  subjects: Subject[];
  grades: GradeRecord[];
  currentUser: User | null;
}

export type ViewState = 'dashboard' | 'grades' | 'subjects' | 'reports' | 'publishing';
