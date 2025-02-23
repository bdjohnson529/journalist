export const OpenAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
export const API_BASE_URL = process.env.REACT_APP_API_URL || '';

if (!OpenAI_API_KEY) {
  throw new Error('OpenAI API key not found in environment variables. Please check your .env file.');
}