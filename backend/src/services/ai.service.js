const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GEMINI_API_KEY } = require('../config/env');

let genAI = null;
if (GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  } catch (error) {
    console.error('Failed to initialize GoogleGenerativeAI:', error);
  }
}

 /**
 * Call Gemini to get a structured JSON response.
 * @param {string|Array<string|object>} prompt Prompt text or array containing text and inline media parts
 * @param {string} systemInstruction Optional system instruction
 * @returns {Promise<object|null>} Parsed JSON response or null if key is missing/failed
 */
const generateJSON = async (prompt, systemInstruction = '') => {
  if (!genAI) {
    return null;
  }

  try {
    const modelName = 'gemini-1.5-flash';
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json',
      },
      systemInstruction: systemInstruction
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini API call failed:', error);
    return null;
  }
};

module.exports = {
  generateJSON,
  isApiConfigured: () => !!genAI
};
