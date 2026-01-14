import { AppState, GradeRecord, Student, Subject } from '../types';
import { INITIAL_STUDENTS, INITIAL_SUBJECTS } from '../constants';

const STORAGE_KEY = 'educontrol_data_v2';

export const getInitialData = (): AppState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    // Ensure migrations if structure changed (simple check)
    if (!parsed.currentUser) parsed.currentUser = null;
    return parsed;
  }
  return {
    students: INITIAL_STUDENTS,
    subjects: INITIAL_SUBJECTS,
    grades: [],
    currentUser: null
  };
};

export const saveData = (data: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getGradeLabel = (level: string, grade: number) => {
  if (level === 'primaria') return `${grade}º Grado`;
  if (level === 'secundaria') return `${grade}º Año`;
  return `${grade}`;
};