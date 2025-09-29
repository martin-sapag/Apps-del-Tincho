
import { GoogleGenAI } from "@google/genai";

export const analyzeFinancialsWithGemini = async (reportData: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `
          Eres un asesor financiero experto y amigable. 
          Tu tarea es analizar el siguiente resumen financiero mensual de una familia y proporcionar un análisis claro y consejos prácticos.
          
          **Resumen Financiero:**
          ${reportData}

          **Instrucciones:**
          1.  **Análisis General:** Comienza con un breve resumen de la situación financiera (ej. "Este mes tuvieron un balance positivo, lo cual es excelente", o "Sus gastos superaron sus ingresos, es importante revisar...").
          2.  **Puntos Clave:** Identifica 1 o 2 puntos clave del informe. Por ejemplo, la categoría de gasto más alta o un ingreso inesperado.
          3.  **Consejos Personalizados:** Ofrece 3 consejos prácticos, específicos y accionables basados en los datos. Los consejos deben ser fáciles de entender y aplicar.
          4.  **Tono:** Mantén un tono alentador y constructivo. El objetivo es empoderar, no criticar.
          
          Formatea tu respuesta en Markdown para una fácil lectura. Usa encabezados, negritas y listas.
          `,
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Hubo un error al contactar al asistente de IA. Por favor, inténtelo de nuevo más tarde.";
  }
};
