"use client";

import React, { useState, useEffect, DragEvent } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { MAX_FILE_SIZE } from "@/lib/constants";

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  const handleFileSelection = (selectedFile: File) => {
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File size exceeds 1MB limit.");
      setFile(null);
      onFileSelect(null);
      return;
    }

    setError(null);
    setFile(selectedFile);
    onFileSelect(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      e.target.value = ""; // Allow re-selecting the same file
      handleFileSelection(selectedFile);
    }
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setError(null);
    onFileSelect(null);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <label
        className={`relative w-[300px] h-[300px] cursor-pointer group border border-gray-300 rounded-lg flex items-center justify-center transition 
        ${dragOver ? "border-blue-500 bg-blue-100" : "hover:border-gray-400"}
        ${previewUrl ? "p-0" : "p-4"}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input type="file" className="hidden" onChange={handleFileChange} />
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Uploaded Preview"
            fill
            className="object-cover rounded-lg shadow group-hover:opacity-70 transition-opacity"
          />
        ) : (
          <div className="text-gray-600 text-center">
            {dragOver ? "Drop to Upload" : "Click to Upload NFT Image"}
            <p className="text-xs text-gray-500 mt-1">(Up to 1 MB)</p>
          </div>
        )}
      </label>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {file && (
        <Button onClick={handleRemoveFile} variant="secondary" className="mt-2">
          Remove Image
        </Button>
      )}
    </div>
  );
};

export default FileUploader;
