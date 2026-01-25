import { useState, useRef, useEffect } from 'react';
import { Camera, Trash2, Upload } from 'lucide-react';

interface PhotoUploadProps {
    onPhotoSelect: (file: File | null) => void;
    currentPhotoUrl?: string | null;
    label?: string;
    className?: string;
    onPhotoDelete?: () => void;
}

export function PhotoUpload({ onPhotoSelect, currentPhotoUrl, label = 'Foto', className = '', onPhotoDelete }: PhotoUploadProps) {
    const [preview, setPreview] = useState<string | null>(currentPhotoUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Update preview when currentPhotoUrl changes (e.g. after data fetch)
    useEffect(() => {
        if (currentPhotoUrl) {
            setPreview(currentPhotoUrl);
        }
    }, [currentPhotoUrl]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            onPhotoSelect(file);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onPhotoSelect(null);
        if (onPhotoDelete) {
            onPhotoDelete();
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={`flex flex-col items-center gap-4 ${className}`}>
            <div
                className="relative group cursor-pointer w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-transform hover:scale-105"
                onClick={triggerFileInput}
            >
                {preview ? (
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                        <Camera className="h-10 w-10 mb-2" />
                        <span className="text-xs font-medium text-center px-4">{label}</span>
                    </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload className="h-8 w-8 text-white" />
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />

            {preview && (
                <button
                    type="button"
                    onClick={handleRemove}
                    className="text-red-600 dark:text-red-400 text-sm flex items-center gap-1 hover:underline"
                >
                    <Trash2 className="h-4 w-4" />
                    Remover foto
                </button>
            )}
        </div>
    );
}
