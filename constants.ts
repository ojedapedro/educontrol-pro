import { Student, Subject, User } from './types';

// Helper to generate IDs
const uuid = () => Math.random().toString(36).substring(2, 9);

// *** CONFIGURACIÓN DE BASE DE DATOS ***
// Reemplaza esta URL con la que obtengas al implementar tu Apps Script
export const GOOGLE_SHEETS_API_URL = 'https://script.google.com/macros/s/AKfycbwskTJ1uAwmC2d5FIQdNEzLb9K7MPrayrD3WvCfIWGKvPgIj-eP9UdsRT6nziJQBdiW/exec'; 

export const INITIAL_USERS: User[] = [
  { id: '1', username: 'admin', name: 'Director General', role: 'admin' },
  { id: '2', username: 'profesor', name: 'Prof. Pedro Pérez', role: 'profesor' },
  { id: '3', username: 'control', name: 'Coord. María (Control)', role: 'control_estudios' },
  { id: '4', username: 'super', name: 'Superintendente Regional', role: 'superintendente' },
  { id: '5', username: 'analistadedatosnova@gmail.com', name: 'Analista de Datos', role: 'admin', password: 'Gene.2302' },
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
  { id: uuid(), cedula: '12345678', name: 'Sofía Martínez', level: 'primaria', grade: 1, section: 'A' },
  { id: uuid(), cedula: '87654321', name: 'Carlos Rodríguez', level: 'primaria', grade: 6, section: 'B' },
  { id: uuid(), cedula: '11223344', name: 'Ana Fernández', level: 'secundaria', grade: 1, section: 'A' },
  { id: uuid(), cedula: '44332211', name: 'Luis González', level: 'secundaria', grade: 3, section: 'C' },
  { id: uuid(), cedula: '55667788', name: 'María Pérez', level: 'secundaria', grade: 5, section: 'A' },
];

export const GRADES_PRIMARIA = [1, 2, 3, 4, 5, 6];
export const GRADES_SECUNDARIA = [1, 2, 3, 4, 5];
export const SECTIONS_LIST = ['A', 'B', 'C', 'D', 'E', 'U']; // U = Unica
