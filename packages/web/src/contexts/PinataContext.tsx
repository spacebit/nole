"use client";

import React, { createContext, useCallback, useContext, useMemo } from "react";
import {
  NFTMetadataOffchain,
  BasicMetadata,
  CollectionMetadataOffchain,
} from "@/types/metadata";

interface PinataContextType {
  uploadFile: (file: File) => Promise<string | null>;
  uploadMetadata: (metadata: BasicMetadata) => Promise<string | null>;
  fetchCollectionMetadata: (url: string) => Promise<BasicMetadata | null>;
  fetchNFTMetadata: (url: string) => Promise<NFTMetadataOffchain | null>;
}

const PinataContext = createContext<PinataContextType | undefined>(undefined);

export const PinataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    try {
      const data = new FormData();
      data.set("file", file);

      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
      });

      const result = await uploadRequest.json();
      return result.url;
    } catch (error) {
      console.error("❌ File Upload Failed:", error);
      return null;
    }
  }, []);

  const uploadMetadata = useCallback(
    async (metadata: BasicMetadata): Promise<string | null> => {
      try {
        const metadataRequest = await fetch("/api/metadata", {
          method: "POST",
          body: JSON.stringify(metadata),
          headers: { "Content-Type": "application/json" },
        });

        const result = await metadataRequest.json();
        return result.url;
      } catch (error) {
        console.error("❌ Metadata Upload Failed:", error);
        return null;
      }
    },
    []
  );

  const fetchMetadata = useCallback(
    async <T extends BasicMetadata>(url: string): Promise<T | null> => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch metadata");

        const metadata: T = await response.json();
        return metadata;
      } catch (error) {
        console.error("❌ Error fetching metadata:", error);
        return null;
      }
    },
    []
  );

  const fetchCollectionMetadata = useCallback(
    (url: string) => fetchMetadata<CollectionMetadataOffchain>(url),
    [fetchMetadata]
  );
  const fetchNFTMetadata = useCallback(
    (url: string) => fetchMetadata<NFTMetadataOffchain>(url),
    [fetchMetadata]
  );

  const contextValue = useMemo(
    () => ({
      uploadFile,
      uploadMetadata,
      fetchCollectionMetadata,
      fetchNFTMetadata,
    }),
    [uploadFile, uploadMetadata, fetchCollectionMetadata, fetchNFTMetadata]
  );

  return (
    <PinataContext.Provider value={contextValue}>
      {children}
    </PinataContext.Provider>
  );
};

export const usePinata = (): PinataContextType => {
  const defaultContext: PinataContextType = {
    uploadFile: async () => null,
    uploadMetadata: async () => null,
    fetchCollectionMetadata: async () => null,
    fetchNFTMetadata: async () => null,
  };

  return useContext(PinataContext) || defaultContext;
};
