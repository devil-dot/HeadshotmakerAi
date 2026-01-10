import { NextRequest, NextResponse } from 'next/server';
import { getGenerativeModel } from '@/lib/gemini';
import { getMimeTypeFromBase64 } from '@/lib/utils';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { images, style } = body;

        // Validation
        if (!images || !Array.isArray(images) || images.length < 2 || images.length > 5) {
            return NextResponse.json(
                { success: false, error: 'Please upload 2-5 images for best results' },
                { status: 400 }
            );
        }

        if (!style || typeof style !== 'string') {
            return NextResponse.json(
                { success: false, error: 'Style prompt is required' },
                { status: 400 }
            );
        }

        // Get the models instance
        const models = getGenerativeModel();

        // EXTREME identity preservation prompt - using editing approach
        const prompt = `⚠️ CRITICAL IDENTITY PRESERVATION TASK ⚠️

YOU ARE EDITING AN EXISTING PHOTO, NOT CREATING A NEW PERSON.

TASK: Take the EXACT person shown in these reference images and create a professional headshot wearing ${style}.

🔴 MANDATORY RULES - VIOLATION IS UNACCEPTABLE:
1. The face MUST be the EXACT SAME person from the reference images
2. COPY every facial feature EXACTLY from the reference images
3. This is the SAME INDIVIDUAL - just in professional attire
4. DO NOT generate a new face
5. DO NOT create a different person
6. DO NOT change ANY facial characteristics
7. PRESERVE 100% facial identity
8. The person's family should recognize them instantly

FACIAL FEATURES TO COPY EXACTLY (DO NOT CHANGE):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Face shape and structure (EXACT match required)
✓ Eye shape, size, color, position (EXACT match required)
✓ Eyebrow shape, thickness, arch (EXACT match required)
✓ Nose bridge, width, tip, nostrils (EXACT match required)
✓ Mouth width, lip thickness, shape (EXACT match required)
✓ Jawline and chin (EXACT match required)
✓ Cheekbones position and prominence (EXACT match required)
✓ Skin tone and complexion (EXACT match required)
✓ Facial hair pattern and density (EXACT match required)
✓ Hair color, texture, hairline (EXACT match required)
✓ Age appearance (EXACT match required)
✓ Moles, freckles, scars (EXACT match required)
✓ Facial proportions (EXACT match required)
✓ Overall appearance (EXACT match required)

WHAT YOU CAN CHANGE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Clothing → ${style}
✓ Background → Professional neutral (light gray)
✓ Lighting → Professional studio lighting
✓ Pose → Professional headshot pose
✓ Expression → Professional (slight smile or neutral)

VERIFICATION BEFORE GENERATING:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ask yourself: "Is this the EXACT SAME person from the reference images?"
If NO → DO NOT GENERATE. Start over.
If YES → Proceed with generation.

THINK OF IT THIS WAY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Imagine the person in the reference images walked into a professional photo studio.
They changed into ${style}.
A photographer took their headshot.
That's what you're creating - NOT a new person.

⚠️ FINAL WARNING:
If the generated face does not EXACTLY match the reference images, this is a FAILURE.
The person's identity is SACRED and MUST NOT be altered.
This is for an official ID photo - accuracy is CRITICAL.

Generate the professional headshot NOW, maintaining PERFECT facial identity.`;

        // Prepare contents array with prompt first, then images
        const contents: any[] = [
            { text: prompt },
            ...images.map((base64Image: string) => ({
                inlineData: {
                    data: base64Image,
                    mimeType: getMimeTypeFromBase64(base64Image),
                },
            })),
        ];

        // Generate content with proper config for image generation
        console.log('Attempting to generate content with Gemini API...');
        console.log('Model:', 'gemini-3-pro-image-preview');
        console.log('Number of images:', images.length);

        let result;
        try {
            result = await models.generateContent({
                model: 'gemini-3-pro-image-preview',
                contents: contents,
                config: {
                    responseModalities: ['IMAGE'],
                    temperature: 0.1, // Absolute minimum for maximum consistency
                    imageConfig: {
                        aspectRatio: '3:4',
                        imageSize: '2K',
                    },
                },
            });
            console.log('API call successful');
        } catch (apiError: any) {
            console.error('Gemini API Error:', apiError);
            console.error('Error message:', apiError.message);
            console.error('Error stack:', apiError.stack);
            throw new Error(`Gemini API failed: ${apiError.message}`);
        }

        // Extract the generated image from the response
        let generatedImageData = null;

        if (result.candidates && result.candidates.length > 0) {
            const candidate = result.candidates[0];
            if (candidate.content && candidate.content.parts) {
                for (const part of candidate.content.parts) {
                    // Check if this part contains inline image data
                    if (part.inlineData && part.inlineData.data) {
                        generatedImageData = part.inlineData.data;
                        break;
                    }
                }
            }
        }

        // If we found image data, return it
        if (generatedImageData) {
            console.log('Image generated successfully');
            return NextResponse.json({
                success: true,
                imageData: generatedImageData,
                message: 'Professional headshot generated successfully',
            });
        }

        // Fallback: if no image data found, return error
        console.error('No image data found in response');
        return NextResponse.json(
            {
                success: false,
                error: 'No image was generated. The API may not have returned image data. Please try again.',
            },
            { status: 500 }
        );
    } catch (error: any) {
        console.error('Error generating headshot:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
        });

        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to generate headshot. Please try again.',
            },
            { status: 500 }
        );
    }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
