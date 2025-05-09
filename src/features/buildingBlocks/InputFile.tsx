import React, { useRef, useState } from 'react';
import { Globe, X, Upload } from 'lucide-react';
import { ButtonGrey, ButtonOutline } from './Button';
import { ButtonSimpleIcon } from './ButtonSimpleIcon';

interface InputFileProps {
  value: string;
  onChange: (value: string) => void;
  accept: string;
  label: string;
  previewType?: 'image' | 'none';
}

export const InputFile: React.FC<InputFileProps> = ({
  value,
  onChange,
  accept,
  label,
  previewType = 'image'
}) => {
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasValue = value !== '';

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChange(url);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChange(url);
    }
  };

  const handleDiscard = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {inputMode === 'upload' ? (
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors duration-300
            ${hasValue ? 'border-white/20' : 'border-white/40'}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept={accept}
            className="hidden"
          />
          {hasValue && previewType === 'image' ? (
            <div className="space-y-2">
              <img
                src={value}
                alt="Preview"
                className="max-h-32 mx-auto object-contain rounded"
              />
              <ButtonSimpleIcon
                icon={X}
                onClick={handleDiscard}
                title={`Discard ${label.toLowerCase()}`}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-white/60">Drop {label.toLowerCase()} here or</p>

              <ButtonGrey
                fullWidth
                label={`Upload ${label.toLowerCase()}`}
                icon={Upload}
                onClick={() => fileInputRef.current?.click()}
              />

              <ButtonOutline
                fullWidth
                icon={Globe}
                label='Use URL instead'
                onClick={() => setInputMode('url')}
                title="Select from the web"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm text-white/60">{label} URL</label>
            <ButtonSimpleIcon
              icon={X}
              onClick={() => {
                onChange('');
                setInputMode('upload');
              }}
              title="Clear URL and switch to upload"
            />
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${label.toLowerCase()} URL`}
            className="w-full bg-black border border-white/20 p-2 text-white focus:outline-none focus:border-white"
          />
        </div>
      )}
    </div>
  );
};