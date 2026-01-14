import { AppState, GradeRecord, Student, Subject } from '../types';
import { INITIAL_STUDENTS, INITIAL_SUBJECTS } from '../constants';

const STORAGE_KEY = 'educontrol_data_v2';

export const getInitialData = (): AppState => {
  try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Robustness checks: Ensure all arrays exist to prevent map/filter crashes
        // If local storage has old or corrupt data, we fallback to defaults for missing parts
        return {
            students: Array.isArray(parsed.students) ? parsed.students : INITIAL_STUDENTS,
            subjects: Array.isArray(parsed.subjects) ? parsed.subjects : INITIAL_SUBJECTS,
            grades: Array.isArray(parsed.grades) ? parsed.grades : [],
            currentUser: parsed.currentUser || null
        };
      }
  } catch (error) {
      console.error("Error reading from local storage, resetting data", error);
      // Fallback if JSON parse fails
  }

  return {
    students: INITIAL_STUDENTS,
    subjects: INITIAL_SUBJECTS,
    grades: [],
    currentUser: null
  };
};

export const saveData = (data: AppState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving data", e);
  }
};

export const getGradeLabel = (level: string, grade: number) => {
  if (level === 'primaria') return `${grade}º Grado`;
  if (level === 'secundaria') return `${grade}º Año`;
  return `${grade}`;
};