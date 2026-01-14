import { Student, Subject, User } from './types';

// Helper to generate IDs
const uuid = () => Math.random().toString(36).substring(2, 9);

export const INITIAL_USERS: User[] = [
  { id: '1', username: 'admin', name: 'Director General', role: 'admin' },
  { id: '2', username: 'profesor', name: 'Prof. Pedro Pérez', role: 'profesor' },
  { id: '3', username: 'control', name: 'Coord. María (Control)', role: 'control_estudios' },
];

// Helper function to create subjects easily
const createSubjects = (names: string[], level: 'primaria' | 'secundaria', grades: number[]) => {
  const subjects: Subject[] = [];
  grades.forEach(grade => {
    names.forEach(name => {
      subjects.push({
        id: uuid(),
        name,
        level,
        grade
      });
    });
  });
  return subjects;
};

// Primaria Subjects (1-6)
const materiasPrimaria = [
  'Lenguaje',
  'Matemáticas',
  'Ciencias Naturales',
  'Ciencias Sociales',
  'Inglés',
  'Arte',
  'Educación Física'
];

// Secundaria Subjects (1-5)
const materiasSecundaria = [
  'Lengua y Literatura',
  'Matemáticas',
  'Biología',
  'Física',
  'Química',
  'Historia',
  'Geografía',
  'Inglés',
  'Educación Cívica',
  'Tecnología'
];

export const INITIAL_SUBJECTS: Subject[] = [
  ...createSubjects(materiasPrimaria, 'primaria', [1, 2, 3, 4, 5, 6]),
  ...createSubjects(materiasSecundaria, 'secundaria', [1, 2, 3, 4, 5])
];

export const INITIAL_STUDENTS: Student[] = [
  { id: uuid(), name: 'Sofía Martínez', level: 'primaria', grade: 1 },
  { id: uuid(), name: 'Carlos Rodríguez', level: 'primaria', grade: 6 },
  { id: uuid(), name: 'Ana Fernández', level: 'secundaria', grade: 1 },
  { id: uuid(), name: 'Luis González', level: 'secundaria', grade: 3 },
  { id: uuid(), name: 'María Pérez', level: 'secundaria', grade: 5 },
];

export const GRADES_PRIMARIA = [1, 2, 3, 4, 5, 6];
export const GRADES_SECUNDARIA = [1, 2, 3, 4, 5];