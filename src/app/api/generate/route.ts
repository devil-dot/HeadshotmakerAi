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

        // Bengali prompt - works better for facial identity preservation
        const prompt = `অফিসের আইডি কার্ড এর জন্য একটা ফর্মাল লুকের ছবি বানিয়ে দাও। আমার চেহারা বা কোন কিছু যেন চেঞ্জ নাহ হয়, ফেস ১০০% আমার হওয়া চাই। এই ইমেজ গুলো আমার, রেফারেন্স এর জন্য দিলাম।
 এই ছবিগুলোতে যে ব্যক্তিকে দেখা যাচ্ছে, তার একটি প্রফেশনাল আইডি ফটো তৈরি করুন যেখানে সে ${style} পরিধান করে আছে।

গুরুত্বপূর্ণ নির্দেশনা:
১. এই ছবিগুলোতে যে মানুষটি আছে, তার চেহারা হুবহু একই রাখতে হবে
২. মুখের কোনো বৈশিষ্ট্য পরিবর্তন করা যাবে না
৩. চোখ, নাক, মুখ, গালের হাড়, চোয়াল - সবকিছু হুবহু একই রাখতে হবে
৪. ত্বকের রঙ একই রাখতে হবে
৫. বয়স একই রাখতে হবে
৬. দাড়ি-গোঁফ থাকলে সেটাও একই রাখতে হবে
৭. চুলের রঙ ও স্টাইল একই রাখতে হবে
৮. তিল, দাগ ইত্যাদি থাকলে সেগুলোও রাখতে হবে

শুধু পরিবর্তন করতে হবে:
- পোশাক: ${style}
- ব্যাকগ্রাউন্ড: হালকা ধূসর বা সাদা
- লাইটিং: প্রফেশনাল স্টুডিও লাইটিং
- পোজ: সোজা ক্যামেরার দিকে তাকিয়ে
- এক্সপ্রেশন: প্রফেশনাল (হালকা হাসি বা নিরপেক্ষ)

মনে রাখবেন: এটি একটি অফিসিয়াল আইডি ফটো। ব্যক্তির চেহারা ১০০% একই থাকতে হবে। তার পরিবার যেন তাকে চিনতে পারে।

এখন এই ব্যক্তির প্রফেশনাল হেডশট তৈরি করুন, চেহারা হুবহু একই রেখে।`;

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
                    temperature: 1.0, // Default temperature (same as AI Studio)
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
