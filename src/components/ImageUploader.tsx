'use client';

import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { UploadedImage } from '@/types';
import { validateImageFile, generateId } from '@/lib/utils';
import Card from './ui/Card';

interface ImageUploaderProps {
    images: UploadedImage[];
    onImagesChange: (images: UploadedImage[]) => void;
    maxImages?: number;
}

export default function ImageUploader({ images, onImagesChange, maxImages = 5 }: ImageUploaderProps) {
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string>('');

    const handleFiles = useCallback(
        (files: FileList | null) => {
            if (!files) return;

            setError('');
            const fileArray = Array.from(files);
            const remainingSlots = maxImages - images.length;

            if (fileArray.length > remainingSlots) {
                setError(`You can only upload ${remainingSlots} more image(s)`);
                return;
            }

            const newImages: UploadedImage[] = [];

            fileArray.forEach((file) => {
                const validation = validateImageFile(file);
                if (!validation.valid) {
                    setError(validation.error || 'Invalid file');
                    return;
                }

                const preview = URL.createObjectURL(file);
                newImages.push({
                    id: generateId(),
                    file,
                    preview,
                });
            });

            onImagesChange([...images, ...newImages]);
        },
        [images, maxImages, onImagesChange]
    );

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
            handleFiles(e.dataTransfer.files);
        },
        [handleFiles]
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            handleFiles(e.target.files);
        },
        [handleFiles]
    );

    const removeImage = useCallback(
        (id: string) => {
            const updatedImages = images.filter((img) => img.id !== id);
            onImagesChange(updatedImages);
            setError('');
        },
        [images, onImagesChange]
    );

    return (
        <Card className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold text-white">
                    Upload Your Selfies
                </h2>
                <span className="text-sm font-medium text-gray-400">
                    {images.length} / {maxImages}
                </span>
            </div>

            <p className="text-gray-400 text-sm">
                Upload 2-5 clear selfies from different angles for best results (more images = better accuracy)
            </p>

            {/* Upload Zone */}
            <div
                className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${dragActive
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-gray-600 hover:border-gray-500'
                    } ${images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleChange}
                    disabled={images.length >= maxImages}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />

                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <p className="text-lg font-medium text-white">
                            Drop your images here, or click to browse
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                            JPG, PNG or WebP (Max 5MB each)
                        </p>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Image Previews */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {images.map((image) => (
                        <div
                            key={image.id}
                            className="relative group aspect-square rounded-lg overflow-hidden bg-gray-800 border border-gray-700"
                        >
                            <img
                                src={image.preview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={() => removeImage(image.id)}
                                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
