// TypeScript type definitions for the application

export interface UploadedImage {
    id: string;
    file: File;
    preview: string;
    base64?: string;
}

export interface GenerateRequest {
    images: string[]; // Base64 encoded images
    style: string;
}

export interface GenerateResponse {
    success: boolean;
    imageUrl?: string;
    imageData?: string; // Base64 encoded result
    error?: string;
}

export interface StyleOption {
    id: string;
    name: string;
    description: string;
    prompt: string;
}

export const PROFESSIONAL_STYLES: StyleOption[] = [
    {
        id: 'formal-navy',
        name: 'Formal Navy Suit',
        description: 'Classic navy blue suit with white shirt and tie',
        prompt: 'a formal navy blue business suit with white dress shirt and professional tie',
    },
    {
        id: 'white-professional',
        name: 'White Shirt Professional',
        description: 'Clean white shirt, business casual',
        prompt: 'a crisp white professional dress shirt, business casual style',
    },
    {
        id: 'doctor-coat',
        name: "Doctor's Coat",
        description: 'Medical professional white coat',
        prompt: 'a white medical doctor\'s coat over professional attire',
    },
    {
        id: 'business-casual',
        name: 'Business Casual',
        description: 'Smart casual blazer and shirt',
        prompt: 'a smart business casual blazer with collared shirt',
    },
    {
        id: 'corporate-headshot',
        name: 'Corporate Headshot',
        description: 'Professional corporate attire',
        prompt: 'professional corporate business attire suitable for executive headshot',
    },
];
