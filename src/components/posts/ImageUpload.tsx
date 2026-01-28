'use client';

import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Alert } from '../common/Alert';

type ImageUploadProps = {
  onUploadComplete: (url: string) => void;
  maxImages?: number;
};

export function ImageUpload({ onUploadComplete, maxImages = 5 }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      setError(`画像は最大${maxImages}枚までアップロードできます`);
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload/image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'アップロードに失敗しました');
        }

        const { url } = await response.json();
        setImages((prev) => [...prev, url]);
        onUploadComplete(url);
      }
    } catch (err: any) {
      setError(err.message || 'アップロードに失敗しました');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {error && <Alert type="error">{error}</Alert>}

      <div className="flex flex-wrap gap-4">
        {images.map((url, index) => (
          <div key={index} className="relative">
            <img
              src={url}
              alt={`Uploaded ${index + 1}`}
              className="w-32 h-32 object-cover rounded-lg border border-gray-800"
            />
            <button
              onClick={() => handleRemove(index)}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {images.length < maxImages && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <LoadingSpinner size="sm" />
                アップロード中...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                画像を追加 ({images.length}/{maxImages})
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
