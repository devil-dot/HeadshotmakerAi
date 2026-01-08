'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { PROFESSIONAL_STYLES, StyleOption } from '@/types';
import Card from './ui/Card';

interface PromptBuilderProps {
    selectedStyle: StyleOption | null;
    onStyleChange: (style: StyleOption) => void;
}

export default function PromptBuilder({ selectedStyle, onStyleChange }: PromptBuilderProps) {
    return (
        <Card className="space-y-4">
            <h2 className="text-2xl font-display font-bold text-white">
                Choose Your Professional Style
            </h2>

            <p className="text-gray-400 text-sm">
                Select the attire style for your professional headshot
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PROFESSIONAL_STYLES.map((style) => (
                    <button
                        key={style.id}
                        onClick={() => onStyleChange(style)}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${selectedStyle?.id === style.id
                                ? 'border-primary-500 bg-primary-500/10'
                                : 'border-gray-600 hover:border-gray-500 bg-gray-800/30'
                            }`}
                    >
                        {selectedStyle?.id === style.id && (
                            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                            </div>
                        )}

                        <h3 className="text-lg font-semibold text-white mb-2">{style.name}</h3>
                        <p className="text-sm text-gray-400">{style.description}</p>
                    </button>
                ))}
            </div>

            {selectedStyle && (
                <div className="p-4 rounded-lg bg-primary-500/10 border border-primary-500/30">
                    <p className="text-sm text-gray-300">
                        <span className="font-semibold text-primary-400">Selected:</span>{' '}
                        {selectedStyle.name}
                    </p>
                </div>
            )}
        </Card>
    );
}
