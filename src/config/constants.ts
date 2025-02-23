export const OpenAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
export const REACT_APP_DOMAIN = process.env.REACT_APP_DOMAIN || 'http://localhost:3000';

if (!OpenAI_API_KEY) {
  throw new Error('OpenAI API key not found in environment variables. Please check your .env file.');
}