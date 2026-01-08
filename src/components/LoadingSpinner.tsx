'use client';

import React from 'react';

export default function LoadingSpinner({ message = 'Generating your professional headshot...' }: { message?: string }) {
    return (
        <div className="flex flex-col items-center justify-center space-y-6 py-12">
            <div className="relative">
                {/* Outer ring */}
                <div className="w-24 h-24 rounded-full border-4 border-primary-500/20"></div>

                {/* Spinning gradient ring */}
                <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-4 border-transparent border-t-primary-500 border-r-accent-500 animate-spin"></div>

                {/* Inner pulsing circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 animate-pulse-slow opacity-50"></div>
            </div>

            <div className="text-center space-y-2">
                <p className="text-lg font-medium text-white animate-pulse">{message}</p>
                <p className="text-sm text-gray-400">This may take a few moments...</p>
            </div>
        </div>
    );
}
