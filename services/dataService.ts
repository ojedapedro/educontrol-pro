import { AppState, GradeRecord, Student, Subject } from '../types';
import { INITIAL_STUDENTS, INITIAL_SUBJECTS, GOOGLE_SHEETS_API_URL } from '../constants';

const STORAGE_KEY = 'educontrol_data_v3';

// --- Local Storage Helpers (Fallback & Sync Cache) ---

const isValidStudent = (s: any): s is Student => s && typeof s.id === 'string' && typeof s.name === 'string';
const isValidSubject = (s: any): s is Subject => s && typeof s.id === 'string' && typeof s.name === 'string';
const isValidGrade = (g: any): g is GradeRecord => g && typeof g.studentId === 'string' && typeof g.score === 'number';

export const getInitialData = (): AppState => {
  try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        const students = Array.isArray(parsed.students) ? parsed.students.filter(isValidStudent) : INITIAL_STUDENTS;
        const subjects = Array.isArray(parsed.subjects) ? parsed.subjects.filter(isValidSubject) : INITIAL_SUBJECTS;
        const grades = Array.isArray(parsed.grades) ? parsed.grades.filter(isValidGrade) : [];

        return {
            students: students.length > 0 ? students : INITIAL_STUDENTS,
            subjects: subjects.length > 0 ? subjects : INITIAL_SUBJECTS,
            grades: grades,
            currentUser: parsed.currentUser || null
        };
      }
  } catch (error) {
      console.error("Error reading from local storage", error);
  }

  return {
    students: INITIAL_STUDENTS,
    subjects: INITIAL_SUBJECTS,
    grades: [],
    currentUser: null
  };
};

export const saveDataLocally = (data: AppState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving data locally", e);
  }
};

// --- Google Sheets Sync Logic ---

export const fetchFromGoogleSheets = async (): Promise<Partial<AppState> | null> => {
    if (!GOOGLE_SHEETS_API_URL) return null;

    try {
        const response = await fetch(GOOGLE_SHEETS_API_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        // Transform incoming data if necessary (e.g., ensure numbers are numbers)
        const students = Array.isArray(data.students) ? data.students.map((s:any) => ({...s, grade: Number(s.grade)})) : [];
        const subjects = Array.isArray(data.subjects) ? data.subjects.map((s:any) => ({...s, grade: Number(s.grade)})) : [];
        const grades = Array.isArray(data.grades) ? data.grades.map((g:any) => ({
            ...g, 
            score: Number(g.score),
            period: Number(g.period),
            isPublished: (g.isPublished === true || g.isPublished === 'TRUE' || g.isPublished === 'true')
        })) : [];

        return { students, subjects, grades };
    } catch (error) {
        console.error("Error fetching from Google Sheets:", error);
        return null; // Return null to indicate failure/fallback needed
    }
};

export const saveToGoogleSheets = async (data: AppState) => {
    if (!GOOGLE_SHEETS_API_URL) return;

    // We send a lightweight payload without the currentUser
    const payload = {
        students: data.students,
        subjects: data.subjects,
        grades: data.grades
    };

    try {
        // Use no-cors mode cautiously, or standard cors if script is deployed as 'Any User'
        // 'text/plain' helps avoid some CORS preflight issues with Google Script sometimes
        await fetch(GOOGLE_SHEETS_API_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        console.log("Synced to Google Sheets");
    } catch (error) {
        console.error("Error saving to Google Sheets:", error);
    }
};

export const getGradeLabel = (level: string, grade: number) => {
  if (level === 'primaria') return `${grade}º Grado`;
  if (level === 'secundaria') return `${grade}º Año`;
  return `${grade}`;
};