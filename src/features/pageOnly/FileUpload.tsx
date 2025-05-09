import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileType } from 'lucide-react';

import { ButtonWhite } from '../buildingBlocks/Button';
import { extractModelFromArchive } from '../../utils/fileUtils';

interface FileUploadProps {
  onModelLoaded: (url: string) => void;
  onLoading: (loading: boolean) => void;
  onError: (error: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onModelLoaded,
  onLoading,
  onError,
  isLoading,
  error
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processFile = useCallback(async (file: File) => {
    onLoading(true);

    try {
      if (file.name.toLowerCase().endsWith('.fbx')) {
        const url = URL.createObjectURL(file);
        onModelLoaded(url);
      } else if (file.name.toLowerCase().endsWith('.zip')) {
        const { modelFile } = await extractModelFromArchive(file);
        if (modelFile) {
          const url = URL.createObjectURL(modelFile);
          onModelLoaded(url);
        } else {
          onError('No FBX file found in the archive.');
        }
      } else {
        onError('Unsupported file format. Please upload a .fbx or .zip file.');
      }
    } catch (err) {
      onError(`Error processing file: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [onLoading, onModelLoaded, onError]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  }, [processFile]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  }, [processFile]);

  const handleButtonClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  return (
    <div className='w-full h-full flex flex-col justify-center items-center'>
      <div
        className={`w-[600px] h-96 border-2 border-dashed rounded-lg transition-colors duration-300 flex flex-col items-center justify-center p-8 text-center
        ${isDragging
            ? 'border-white bg-white/10'
            : 'border-white/20 hover:border-white/40'
          }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          className="hidden"
          accept=".fbx,.zip"
        />

        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-white border-r-white border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-white/80">Processing your file...</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-medium mb-2">Upload 3D Model</h2>

            <p className="text-white/60 mb-6 text-center max-w-md">
              Drag and drop your .fbx or .zip file here, or click to select
            </p>

            <ButtonWhite
              label='Select File'
              icon={Upload}
              onClick={handleButtonClick}
            />

            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400">
                {error}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};