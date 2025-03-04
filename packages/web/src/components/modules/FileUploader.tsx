"use client";

import React, { useState, useEffect, DragEvent } from "react";
import { usePinataUpload } from "@/hooks/usePinataUpload";
import Image from "next/image";
import Button from "@/components/ui/Button";

const FileUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const { uploading, uploadFile } = usePinataUpload();
  const [isUploaded, setIsUploaded] = useState(false);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setUploadedUrl(null);
      setIsUploaded(false);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      const url = await uploadFile(file);
      if (url) {
        setUploadedUrl(url);
        setIsUploaded(true);
        setPreviewUrl(null);
      }
    }
  };

  return (
    <div
      className="flex flex-col items-center space-y-4 p-6 bg-white rounded-xl shadow-lg w-full max-w-sm"
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <h2 className="text-lg font-semibold text-gray-800">Upload an Image</h2>

      {!previewUrl && !uploadedUrl ? (
        <label
          className={`flex flex-col items-center justify-center w-[300px] h-[300px] border-2 ${
            dragOver ? "border-blue-500 bg-blue-100" : "border-gray-300"
          } border-dashed rounded-lg cursor-pointer hover:border-gray-400 transition text-center`}
        >
          <input type="file" className="hidden" onChange={handleFileChange} />
          <span className="text-gray-600">
            {dragOver ? "Drop to Upload" : "Drag & Drop or Click to Select"}
          </span>
        </label>
      ) : (
        <label className="relative w-[300px] h-[300px] cursor-pointer group">
          <input type="file" className="hidden" onChange={handleFileChange} />
          <Image
            src={uploadedUrl || previewUrl!} // ✅ Show uploaded image OR preview
            alt="Uploaded"
            fill
            className="object-cover rounded-lg border border-gray-200 shadow group-hover:opacity-70 transition-opacity"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-40 text-white text-sm font-semibold rounded-lg">
            Click to Change Image
          </div>
        </label>
      )}

      <Button onClick={handleUpload} disabled={uploading || !file || isUploaded}>
        {isUploaded ? "Uploaded" : uploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
};

export default FileUploader;
