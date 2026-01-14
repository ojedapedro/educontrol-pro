import { GoogleGenAI } from "@google/genai";
import { GradeRecord, Subject } from "../types";

export const generateStudentReport = async (
  studentName: string,
  level: string,
  gradeYear: number,
  grades: GradeRecord[],
  subjects: Subject[]
): Promise<string> => {
  try {
    // Initialization moved here to prevent app crash on load if API_KEY is missing or invalid
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const subjectMap = new Map(subjects.map(s => [s.id, s.name]));
    
    let gradeSummary = "Calificaciones:\n";
    let totalScore = 0;
    let count = 0;

    grades.forEach(g => {
        const subjectName = subjectMap.get(g.subjectId) || "Desconocida";
        gradeSummary += `- ${subjectName} (Lapso ${g.period}): ${g.score}/20\n`;
        totalScore += g.score;
        count++;
    });

    const average = count > 0 ? (totalScore / count).toFixed(2) : 0;

    const prompt = `
      Actúa como un coordinador académico pedagógico experimentado.
      Analiza el rendimiento del estudiante: ${studentName}.
      Nivel: ${level}, Grado/Año: ${gradeYear}.
      Promedio actual: ${average}.
      
      Datos crudos:
      ${gradeSummary}
      
      Por favor genera un reporte cualitativo breve (máximo 2 párrafos) dirigido a los padres.
      Destaca las fortalezas y áreas de mejora. Usa un tono constructivo, motivador y profesional en Español.
      No saludes, empieza directamente con el análisis.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "No se pudo generar el reporte.";
  } catch (error) {
    console.error("Error generating report:", error);
    return "Servicio de análisis no disponible en este momento. Verifique la configuración.";
  }
};