"use client";

import { Metadata } from "@/types/metadata";
import React, { createContext, useContext, useState } from "react";

interface PinataContextType {
  uploadedUrl: string | null;
  setUploadedUrl: (url: string | null) => void;
  metadataUrl: string | null;
  setMetadataUrl: (url: string | null) => void;
  uploadFile: (file: File) => Promise<string | null>;
  uploadMetadata: (metadata: Metadata) => Promise<string | null>;
  uploading: boolean;
}

const PinataContext = createContext<PinataContextType | undefined>(undefined);

export const PinataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [metadataUrl, setMetadataUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File): Promise<string | null> => {
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
      console.error("❌ File Upload Failed:", error);
      setUploading(false);
      return null;
    }
  };

  const uploadMetadata = async (metadata: Metadata): Promise<string | null> => {
    try {
      setUploading(true);
      
      const metadataRequest = await fetch("/api/metadata", {
        method: "POST",
        body: JSON.stringify(metadata),
        headers: { "Content-Type": "application/json" },
      });
  
      const result = await metadataRequest.json();
      setMetadataUrl(result.url);
      setUploading(false);
      return result.url;
    } catch (error) {
      console.error("❌ Metadata Upload Failed:", error);
      setUploading(false);
      return null;
    }
  };

  return (
    <PinataContext.Provider value={{ uploadedUrl, setUploadedUrl, metadataUrl, setMetadataUrl, uploadFile, uploadMetadata, uploading }}>
      {children}
    </PinataContext.Provider>
  );
};

export const usePinata = (): PinataContextType => {
  const context = useContext(PinataContext);
  if (!context) {
    throw new Error("usePinata must be used within a PinataProvider");
  }
  return context;
};
