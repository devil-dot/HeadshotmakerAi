# AI Agent Instructions for "BananaID" Project

**Role:** You are an expert Full-Stack AI Engineer specializing in Next.js 15, TypeScript, and Generative AI integrations.

**Goal:** Build a web application that takes 5 user selfies as input and generates a professional ID card photo using Google's Gemini models (referred to as "Nano Banana" or "Gemini 3").

**Key Requirement:** The generated image must preserve the user's facial identity (100% likeness) while changing the attire to formal wear.

## Tech Stack
- **Frontend:** Next.js 15 (App Router), React, Tailwind CSS, Lucide React (Icons).
- **Backend:** Next.js API Routes (Serverless).
- **AI Integration:** `@google/generative-ai` SDK.

## Implementation Steps

### Step 1: Setup & Configuration
- Initialize a Next.js 15 project with TypeScript and Tailwind.
- Install `@google/generative-ai`.
- Create `.env.local` and ensure `GOOGLE_API_KEY` is used securely on the server side.

### Step 2: Component Development
1. **`ImageUploader.tsx`**: Create a drag-and-drop zone that accepts exactly 5 images. Show thumbnails of uploaded images. Convert these images to Base64 strings for the API.
2. **`PromptBuilder.tsx`**: A simple text input or dropdown to select the target style (e.g., "Formal Navy Suit", "White Shirt", "Doctor's Coat").
3. **`ResultDisplay.tsx`**: A clean card to display the generated image with a "Download" button.

### Step 3: Backend Logic (`src/app/api/generate/route.ts`)
- **Route:** POST `/api/generate`
- **Logic:**
  1. Receive `{ images: string[], prompt: string }` from the frontend.
  2. Initialize the Google GenAI model (Target model: `gemini-2.0-flash-exp` or `gemini-1.5-pro` as proxies for "Nano Banana").
  3. **System Prompt Strategy:** 
     - Instruct the model to act as a "Identity-Preserving Portrait Generator".
     - Pass the 5 base64 images as inline data.
     - Instruction: "Analyze these 5 images. Generate a highly realistic ID photo of this EXACT person wearing [User Prompt]. Maintain facial features, bone structure, and skin tone 100%."
  4. Return the generated content.

### Step 4: UI/UX
- Use a dark/modern theme.
- Show a skeleton loader or spinner while generating (it may take seconds).
- Handle errors gracefully (e.g., "Failed to generate, try again").

## Critical Rules
- **Do NOT** leak API keys to the client side.
- **Do NOT** use dummy data for the final implementation; wire up the real API.
- Ensure the prompt emphasizes **"Identity Preservation"** above all else.

## Execution Order
1. Scaffold project structure.
2. Create UI components.
3. Build API route.
4. Integrate API with UI.
