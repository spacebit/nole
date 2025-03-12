"use client";

import React, { useCallback, useState } from "react";
import { usePinata } from "@/contexts/PinataContext";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import useCollectionRegistry from "@/hooks/useCollectionRegistry";
import { Hex } from "@nilfoundation/niljs";
import { useUserAssets } from "@/contexts/UserAssetsContext";
import { useLoader } from "@/contexts/LoaderContext";
import FileUploader from "./FileUploader";

const CreateCollectionForm: React.FC = () => {
  const { uploadFile, uploadMetadata } = usePinata();
  const { createCollection } = useCollectionRegistry(
    process.env.NEXT_PUBLIC_REGISTRY_ADDRESS as Hex
  );
  const { fetchUserCollections } = useUserAssets();
  const { showLoader, hideLoader } = useLoader();

  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [symbol, setSymbol] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateCollection = useCallback(async () => {
    showLoader("Uploading collection...", "loading");
    setIsSubmitting(true);

    if (!file || !name.trim() || !description.trim() || !symbol.trim()) {
      showLoader("Please fill out all fields and upload an image.", "error");
      setTimeout(hideLoader, 5000);
      setIsSubmitting(false);
      return;
    }

    try {
      const imageUrl = await uploadFile(file);
      if (!imageUrl) {
        showLoader("Image upload failed.", "error");
        setTimeout(hideLoader, 5000);
        return;
      }

      const metadata = { name, description, image: imageUrl };
      const metadataUrl = await uploadMetadata(metadata);
      if (!metadataUrl) {
        showLoader("Metadata upload failed.", "error");
        setTimeout(hideLoader, 5000);
        return;
      }

      await createCollection(name.trim(), symbol.trim(), metadataUrl);
      showLoader("Collection created successfully!", "success");

      await fetchUserCollections();

      setFile(null);
      setName("");
      setDescription("");
      setSymbol("");

      setTimeout(hideLoader, 5000);
    } catch {
      showLoader("Something went wrong.", "error");
      setTimeout(hideLoader, 5000);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    createCollection,
    description,
    fetchUserCollections,
    file,
    name,
    showLoader,
    symbol,
    uploadFile,
    uploadMetadata,
    hideLoader,
  ]);

  return (
    <div className="flex flex-col space-y-6 p-6 bg-white rounded-xl shadow-lg w-full max-w-3xl">
      <Text variant="h1">Create new Collection</Text>

      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="w-full md:w-[40%] flex flex-col items-center">
          <FileUploader onFileSelect={setFile} />
        </div>

        <div className="flex flex-col w-full md:w-[60%] space-y-4">
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

          <Button onClick={handleCreateCollection} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Collection"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateCollectionForm;
