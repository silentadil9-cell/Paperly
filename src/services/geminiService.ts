import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function extractQuestionsFromImage(base64Image: string, language: string = "en") {
  const prompt = `
    You are an expert OCR and exam question extractor. 
    Analyze this image of a handwritten or printed exam paper.
    Extract every question, its number, and its marks.
    If the paper is in ${language === 'ur' ? 'Urdu' : 'English'}, extract the text exactly in that language.
    Return the result as a valid JSON object in this format:
    {
      "sections": [
        {
          "title": "Section Title",
          "questions": [
            { "number": "1", "text": "Question text here", "marks": 5 }
          ]
        }
      ]
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      { text: prompt },
      {
        inlineData: {
          data: base64Image.split(',')[1],
          mimeType: "image/jpeg"
        }
      }
    ],
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text);
}

export async function cloneStyleFromImage(base64Image: string) {
  const prompt = `
    Analyze the layout and style of this exam paper.
    Determine:
    1. Font family (serif or sans)
    2. Header alignment (left, center, right)
    3. Border style under header (none, single, double)
    4. General Instructions label text
    Return style parameters as JSON:
    {
      "font": "serif",
      "headerAlign": "center",
      "borderStyle": "single",
      "instructionsLabel": "General Instructions"
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      { text: prompt },
      {
        inlineData: {
          data: base64Image.split(',')[1],
          mimeType: "image/jpeg"
        }
      }
    ],
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text);
}

export async function generatePaperFromText(sourceText: string, requirements: any) {
  const prompt = `
    Based on the following textbook content, generate an exam paper.
    Requirements:
    - Subject: ${requirements.subject}
    - Class: ${requirements.class}
    - Language: ${requirements.language || 'English'}
    - Sections: ${JSON.stringify(requirements.sections)}
    
    Source Text: 
    ${sourceText.slice(0, 30000)}

    Return valid JSON.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text);
}
