import { GoogleGenAI } from '@google/genai';

if (!process.env.GOOGLE_API_KEY) {
    throw new Error('GOOGLE_API_KEY is not defined in environment variables');
}

// Initialize the Google GenAI client (new SDK)
const genAI = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

// Get the Gemini model for image generation
// Using gemini-3-pro-image-preview which supports up to 5 reference images of humans
export const getGenerativeModel = () => {
    return genAI.models;
};

export default genAI;
