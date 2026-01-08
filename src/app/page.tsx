'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import PromptBuilder from '@/components/PromptBuilder';
import ResultDisplay from '@/components/ResultDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';
import Button from '@/components/ui/Button';
import { UploadedImage, StyleOption } from '@/types';
import { fileToBase64 } from '@/lib/utils';

export default function Home() {
    const [images, setImages] = useState<UploadedImage[]>([]);
    const [selectedStyle, setSelectedStyle] = useState<StyleOption | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [error, setError] = useState<string>('');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const canGenerate = images.length >= 2 && images.length <= 5 && selectedStyle !== null;

    const handleGenerate = async () => {
        if (!canGenerate) return;

        setIsGenerating(true);
        setError('');
        setGeneratedImage(null);

        try {
            // Convert all images to base64
            const base64Images = await Promise.all(
                images.map((img) => fileToBase64(img.file))
            );

            // Call the API
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    images: base64Images,
                    style: selectedStyle?.prompt,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate headshot');
            }

            if (data.success && data.imageData) {
                setGeneratedImage(data.imageData);
            } else {
                // For demo purposes, if no image is returned, show a message
                setError('Image generation is in progress. The API response was: ' + (data.result || data.message));
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred while generating your headshot');
            console.error('Generation error:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRegenerate = () => {
        setGeneratedImage(null);
        setError('');
    };

    return (
        <main className="min-h-screen relative overflow-hidden">
            {/* Background particles effect - only render on client */}
            {isMounted && (
                <div className="particles">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 20}s`,
                                animationDuration: `${15 + Math.random() * 10}s`,
                            }}
                        />
                    ))}
                </div>
            )}

            <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
                {/* Header */}
                <header className="text-center mb-12 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 mb-6 shadow-2xl shadow-primary-500/50">
                        <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400">
                        Professional Headshot Maker
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Transform your selfies into professional ID photos using advanced AI technology
                    </p>
                </header>

                {/* Main Content */}
                <div className="space-y-8">
                    {/* Step 1: Upload Images */}
                    <div className="animate-slide-up">
                        <ImageUploader
                            images={images}
                            onImagesChange={setImages}
                            maxImages={5}
                        />
                    </div>

                    {/* Step 2: Select Style */}
                    {images.length > 0 && (
                        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <PromptBuilder
                                selectedStyle={selectedStyle}
                                onStyleChange={setSelectedStyle}
                            />
                        </div>
                    )}

                    {/* Generate Button */}
                    {images.length > 0 && (
                        <div className="flex justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <Button
                                onClick={handleGenerate}
                                disabled={!canGenerate || isGenerating}
                                loading={isGenerating}
                                size="lg"
                                className="px-12"
                            >
                                <Sparkles className="w-5 h-5 mr-2" />
                                Generate Professional Headshot
                            </Button>
                        </div>
                    )}

                    {/* Loading State */}
                    {isGenerating && (
                        <div className="animate-fade-in">
                            <LoadingSpinner />
                        </div>
                    )}

                    {/* Error Message */}
                    {error && !isGenerating && (
                        <div className="max-w-2xl mx-auto p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/50 text-yellow-300 text-sm animate-fade-in">
                            <p className="font-semibold mb-1">Note:</p>
                            <p>{error}</p>
                            <p className="mt-2 text-xs text-yellow-400">
                                This is a demonstration. In production, the Gemini API would return the generated image.
                            </p>
                        </div>
                    )}

                    {/* Result Display */}
                    {generatedImage && !isGenerating && (
                        <ResultDisplay
                            imageData={generatedImage}
                            onRegenerate={handleRegenerate}
                        />
                    )}
                </div>

                {/* Footer */}
                <footer className="mt-16 text-center text-gray-500 text-sm">
                    <p>Powered by Google Gemini AI • Built with Next.js 15</p>
                </footer>
            </div>
        </main>
    );
}
