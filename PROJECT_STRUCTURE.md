# Project Structure: BananaID (ProID Gen)

This project is built using Next.js 15 (App Router), TypeScript, Tailwind CSS, and Google Gemini API.

## Directory Tree
banana-id-gen/
├── .env.local # Environment variables (GOOGLE_API_KEY)
├── next.config.mjs # Next.js configuration
├── package.json # Dependencies
├── tailwind.config.ts # Tailwind configuration
├── tsconfig.json # TypeScript configuration
├── public/
│ ├── assets/ # Static assets (logos, placeholders)
│ └── output/ # (Optional) Temporary storage for downloads
├── src/
│ ├── app/
│ │ ├── api/
│ │ │ └── generate/ # API Route for interacting with Gemini/Nano Banana
│ │ │ └── route.ts # Main logic: Image processing & prompt sending
│ │ ├── layout.tsx # Root layout
│ │ ├── page.tsx # Main landing page (UI entry point)
│ │ └── globals.css # Global styles & Tailwind directives
│ ├── components/
│ │ ├── ui/ # Reusable basic UI (Buttons, Cards, Inputs)
│ │ ├── ImageUploader.tsx # Drag & drop area for 5 reference images
│ │ ├── PromptBuilder.tsx # Form to select style (Suit, Casual, etc.)
│ │ ├── ResultDisplay.tsx # Component to show the generated image
│ │ └── LoadingSpinner.tsx # Loading state animation
│ ├── lib/
│ │ ├── gemini.ts # Google Generative AI Client Initialization
│ │ └── utils.ts # Helper functions (Base64 conversion, etc.)
│ └── types/
│ └── index.ts # TypeScript interfaces (API responses, Props)
code
Code
## Key Files Description

- **src/lib/gemini.ts**: Initialize `GoogleGenerativeAI` instance here using `process.env.GOOGLE_API_KEY`.
- **src/app/api/generate/route.ts**: This is the brain. It receives 5 images + prompt, formats them for the Multimodal model, and returns the generated image/text.
- **src/components/ImageUploader.tsx**: Must support multiple file selection and preview.
