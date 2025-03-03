"use client";

import { useState } from "react";

export const usePinataUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    if (!file) {
      alert("No file selected");
      return;
    }

    try {
      setUploading(true);
      const data = new FormData();
      data.set("file", file);

      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
      });

      const result = await uploadRequest.json();
      setUploadedUrl(result.url);
      setUploading(false);

      return result.url;
    } catch (error) {
      console.error("❌ Upload failed:", error);
      setUploading(false);
    }
  };

  return { uploading, uploadedUrl, uploadFile };
};
