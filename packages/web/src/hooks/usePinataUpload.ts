"use client";

import { useCallback, useState } from "react";

export const usePinataUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File) => {
    if (!file) throw new Error("No file selected");

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
      return result.url;
    } catch (error) {
      console.error("❌ Upload failed:", error);
      return null;
    } finally {
      setUploading(false);
    }
  }, []);


  return { uploading, uploadedUrl, uploadFile };
};
