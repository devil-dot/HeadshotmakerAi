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

        // Construct ultra-detailed prompt for maximum facial accuracy
        const prompt = `CRITICAL TASK: Create a professional ID photo that EXACTLY matches the person in the reference images.

STEP 1 - ANALYZE REFERENCE IMAGES:
Study ALL reference images carefully and identify:
- Exact face shape (oval, round, square, heart-shaped, etc.)
- Precise eye characteristics: shape, size, color, eyelid type, eye spacing
- Exact eyebrow shape, thickness, arch, and position
- Precise nose structure: bridge width, nostril shape, nose length, tip shape
- Exact mouth and lip features: lip thickness, mouth width, cupid's bow shape
- Jawline and chin structure
- Cheekbone prominence and position
- Skin tone (exact shade)
- Facial hair (if any): type, color, density
- Hair: exact color, texture, hairline
- Unique identifying features: moles, freckles, scars, dimples, wrinkles
- Age appearance
- Facial proportions and symmetry

STEP 2 - GENERATE IMAGE:
Create a professional headshot photo of THIS EXACT SAME PERSON wearing ${style}

ABSOLUTE REQUIREMENTS - FACIAL IDENTITY:
🔴 The generated face MUST be IDENTICAL to the reference images
🔴 DO NOT change ANY facial features
🔴 DO NOT make the person look younger or older
🔴 DO NOT change skin tone or complexion
🔴 DO NOT alter eye color, shape, or size
🔴 DO NOT modify nose structure
🔴 DO NOT change mouth or lip shape
🔴 DO NOT remove or add facial features (moles, freckles, etc.)
🔴 The person must be IMMEDIATELY recognizable as the same individual

TECHNICAL REQUIREMENTS:
- Professional studio lighting (soft, flattering, even)
- Solid neutral background (light gray #E5E5E5 or soft white #F5F5F5)
- Direct eye contact with camera
- Natural professional expression (slight smile or neutral)
- Sharp focus on face
- Head and shoulders composition
- Professional photography quality
- Proper exposure and color balance

VERIFICATION:
Before finalizing, verify that:
✓ Face shape matches reference images exactly
✓ All facial features are identical to reference
✓ Skin tone is accurate
✓ Age appearance is consistent
✓ Unique features are preserved
✓ The person is clearly recognizable

CRITICAL: This is for an official ID photo. The facial identity MUST be 100% accurate. Any deviation from the reference images is UNACCEPTABLE.`;

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
                    temperature: 0.2, // Very low for maximum facial consistency
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
