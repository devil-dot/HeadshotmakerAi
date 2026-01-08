'use client';

import React from 'react';
import { Download, RefreshCw } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import { downloadBase64Image } from '@/lib/utils';

interface ResultDisplayProps {
    imageData: string | null;
    onRegenerate: () => void;
}

export default function ResultDisplay({ imageData, onRegenerate }: ResultDisplayProps) {
    if (!imageData) return null;

    const handleDownload = () => {
        if (imageData) {
            const timestamp = new Date().toISOString().split('T')[0];
            downloadBase64Image(imageData, `professional-headshot-${timestamp}.png`);
        }
    };

    return (
        <Card className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold text-white">
                    Your Professional Headshot
                </h2>
            </div>

            {/* Generated Image Display */}
            <div className="relative rounded-xl overflow-hidden bg-gray-800 border border-gray-700">
                <img
                    src={`data:image/png;base64,${imageData}`}
                    alt="Generated Professional Headshot"
                    className="w-full h-auto"
                />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    onClick={handleDownload}
                    variant="primary"
                    size="lg"
                    className="flex-1"
                >
                    <Download className="w-5 h-5 mr-2" />
                    Download Headshot
                </Button>

                <Button
                    onClick={onRegenerate}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Generate Again
                </Button>
            </div>

            {/* Tips */}
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <p className="text-sm text-blue-300">
                    <span className="font-semibold">💡 Tip:</span> You can generate multiple versions
                    by trying different professional styles!
                </p>
            </div>
        </Card>
    );
}
