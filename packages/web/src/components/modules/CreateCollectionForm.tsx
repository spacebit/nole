"use client";

import React, { useCallback, useState } from "react";
import { usePinata } from "@/contexts/PinataContext";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import useCollectionRegistry from "@/hooks/useCollectionRegistry";
import { Hex } from "@nilfoundation/niljs";
import { useUserAssets } from "@/contexts/UserAssetsContext";
import Loader from "@/components/ui/Loader";

const CreateCollectionForm: React.FC = () => {
  const { setUploadedUrl, uploadFile, uploadMetadata, uploading } = usePinata();
  const { createCollection } = useCollectionRegistry(process.env.NEXT_PUBLIC_REGISTRY_ADDRESS as Hex);
  const { fetchUserCollections } = useUserAssets();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [symbol, setSymbol] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ message: string; status: "loading" | "success" | "error" } | null>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0];
      setFile(newFile);
      setPreviewUrl(URL.createObjectURL(newFile));
      setStatusMessage(null);
    }
  }, []);

  const handleCreateCollection = useCallback(async () => {
    setStatusMessage({ message: "Uploading collection...", status: "loading" });
    setIsSubmitting(true);

    if (!file || !name.trim() || !description.trim() || !symbol.trim()) {
      setStatusMessage({ message: "Please fill out all fields and upload an image.", status: "error" });
      setIsSubmitting(false);
      return;
    }

    try {
      const imageUrl = await uploadFile(file);
      if (!imageUrl) {
        setStatusMessage({ message: "Image upload failed.", status: "error" });
        setIsSubmitting(false);
        return;
      }

      setUploadedUrl(imageUrl);
      const metadata = { name, description, image: imageUrl };
      const metadataUrl = await uploadMetadata(metadata);
      if (!metadataUrl) {
        setStatusMessage({ message: "Metadata upload failed.", status: "error" });
        setIsSubmitting(false);
        return;
      }

      await createCollection(name.trim(), symbol.trim(), metadataUrl);
      setStatusMessage({ message: "Collection created successfully!", status: "success" });

      await fetchUserCollections();
      setIsSubmitting(false);

      setFile(null);
      setPreviewUrl(null);
      setName("");
      setDescription("");
      setSymbol("");
    } catch {
      setStatusMessage({ message: "Something went wrong.", status: "error" });
      setIsSubmitting(false);
    }
  }, [createCollection, description, fetchUserCollections, file, name, setUploadedUrl, symbol, uploadFile, uploadMetadata]);

  return (
    <div className="flex flex-col items-center space-y-6 p-6 bg-white rounded-xl shadow-lg w-full max-w-md">
      <Text variant="h1">Create a Collection</Text>

      {statusMessage && <Loader message={statusMessage.message} status={statusMessage.status} />}

      <label className="relative w-[300px] h-[300px] cursor-pointer group border border-gray-300 rounded-lg flex items-center justify-center">
        <input type="file" className="hidden" onChange={handleFileChange} />
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Collection Preview"
            fill
            className="object-cover rounded-lg shadow group-hover:opacity-70 transition-opacity"
          />
        ) : (
          <div className="text-gray-600 text-center">Click to Upload Collection Image</div>
        )}
      </label>

      <input
        type="text"
        placeholder="Collection Name"
        className="w-full p-2 border border-gray-300 rounded-lg"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Collection Symbol"
        className="w-full p-2 border border-gray-300 rounded-lg"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      />
      <textarea
        placeholder="Collection Description"
        className="w-full p-2 border border-gray-300 rounded-lg"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Button onClick={handleCreateCollection} disabled={uploading || isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Collection"}
      </Button>
    </div>
  );
};

export default CreateCollectionForm;
