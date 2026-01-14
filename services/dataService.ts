import { AppState, GradeRecord, Student, Subject } from '../types';
import { INITIAL_STUDENTS, INITIAL_SUBJECTS } from '../constants';

const STORAGE_KEY = 'educontrol_data_v3'; // Changed key to force reset if needed

// Helper to validate if an object has basic required fields
const isValidStudent = (s: any): s is Student => s && typeof s.id === 'string' && typeof s.name === 'string';
const isValidSubject = (s: any): s is Subject => s && typeof s.id === 'string' && typeof s.name === 'string';
const isValidGrade = (g: any): g is GradeRecord => g && typeof g.studentId === 'string' && typeof g.score === 'number';

export const getInitialData = (): AppState => {
  try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Strict Validation: If data inside arrays is corrupt (null or wrong shape), filter it out
        // or fallback to defaults if the array itself is missing.
        const students = Array.isArray(parsed.students) 
            ? parsed.students.filter(isValidStudent) 
            : INITIAL_STUDENTS;

        const subjects = Array.isArray(parsed.subjects) 
            ? parsed.subjects.filter(isValidSubject) 
            : INITIAL_SUBJECTS;

        const grades = Array.isArray(parsed.grades) 
            ? parsed.grades.filter(isValidGrade) 
            : [];

        // If validation stripped out all students (e.g. empty array caused by bug), restore defaults
        return {
            students: students.length > 0 ? students : INITIAL_STUDENTS,
            subjects: subjects.length > 0 ? subjects : INITIAL_SUBJECTS,
            grades: grades,
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