"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { NFTMetadata, Metadata } from "@/types/metadata";

interface PinataContextType {
  uploadedUrl: string | null;
  setUploadedUrl: (url: string | null) => void;
  metadataUrl: string | null;
  setMetadataUrl: (url: string | null) => void;
  uploadFile: (file: File) => Promise<string | null>;
  uploadMetadata: (metadata: Metadata) => Promise<string | null>;
  fetchCollectionMetadata: (url: string) => Promise<Metadata | null>;
  fetchNFTMetadata: (url: string) => Promise<NFTMetadata | null>;
  uploading: boolean;
}

const PinataContext = createContext<PinataContextType | undefined>(undefined);

export const PinataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [metadataUrl, setMetadataUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
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
  }, []);

  const uploadMetadata = useCallback(
    async (metadata: Metadata): Promise<string | null> => {
      try {
        setUploading(true);
        const metadataRequest = await fetch("/api/metadata", {
          method: "POST",
          body: JSON.stringify(metadata),
          headers: { "Content-Type": "application/json" },
        });

        const result = await metadataRequest.json();
        setMetadataUrl(result.url);
        return result.url;
      } catch (error) {
        console.error("❌ Metadata Upload Failed:", error);
        return null;
      } finally {
        setUploading(false);
      }
    },
    []
  );

  const fetchMetadata = async <T extends Metadata>(
    url: string
  ): Promise<T | null> => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch metadata");

      const metadata: T = await response.json();
      return metadata;
    } catch (error) {
      console.error("❌ Error fetching metadata:", error);
      return null;
    }
  };

  const fetchCollectionMetadata = useCallback(
    (url: string) => fetchMetadata<Metadata>(url),
    []
  );
  const fetchNFTMetadata = useCallback(
    (url: string) => fetchMetadata<NFTMetadata>(url),
    []
  );

  const contextValue = useMemo(
    () => ({
      uploadedUrl,
      setUploadedUrl,
      metadataUrl,
      setMetadataUrl,
      uploadFile,
      uploadMetadata,
      uploading,
      fetchCollectionMetadata,
      fetchNFTMetadata,
    }),
    [
      uploadedUrl,
      metadataUrl,
      uploadFile,
      uploadMetadata,
      uploading,
      fetchCollectionMetadata,
      fetchNFTMetadata,
    ]
  );

  return (
    <PinataContext.Provider value={contextValue}>
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
