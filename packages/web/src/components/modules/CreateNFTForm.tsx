"use client";

import React, { useState } from "react";
import { usePinata } from "@/contexts/PinataContext";
import { useUserAssets } from "@/contexts/UserAssetsContext";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import useCollectionContract from "@/hooks/useCollectionContract";
import { Hex } from "@nilfoundation/niljs";

const CreateNFTForm: React.FC = () => {
  const { uploadFile, uploadMetadata, uploading } = usePinata();
  const { collections, fetchNFTs } = useUserAssets();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<Hex | null>(null);
  const [attributes, setAttributes] = useState<{ trait_type: string; value: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const collectionContract = useCollectionContract(selectedCollection as Hex);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0];
      setFile(newFile);
      setPreviewUrl(URL.createObjectURL(newFile));
      setError(null);
    }
  };

  const handleAddAttribute = () => {
    setAttributes([...attributes, { trait_type: "", value: "" }]);
  };

  const handleAttributeChange = (index: number, field: "trait_type" | "value", value: string) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index][field] = value;
    setAttributes(updatedAttributes);
  };

  const handleCreateNFT = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!file || !name.trim() || !description.trim() || !selectedCollection) {
      setError("Please fill out all fields and upload an image.");
      return;
    }

    setIsSubmitting(true);

    try {
      const imageUrl = await uploadFile(file);
      if (!imageUrl) {
        setError("Image upload failed. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const metadata = {
        name,
        description,
        image: imageUrl,
        attributes,
      };

      const metadataUrl = await uploadMetadata(metadata);
      if (!metadataUrl) {
        setError("Metadata upload failed. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const tokenId = BigInt(Date.now()); // Generate unique tokenId (use a better logic in production)
      const mintTx = await collectionContract.mintNFT(
        selectedCollection as Hex,
        tokenId,
        metadataUrl
      );

      if (mintTx) {
        setSuccessMessage("NFT created successfully!");
        fetchNFTs();
      } else {
        setError("Transaction failed. Please try again.");
      }

      setFile(null);
      setPreviewUrl(null);
      setName("");
      setDescription("");
      setSelectedCollection(null);
      setAttributes([]);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6 bg-white rounded-xl shadow-lg w-full max-w-md">
      <Text variant="h1">Create an NFT</Text>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

      {/* Image Upload */}
      <label className="relative w-[300px] h-[300px] cursor-pointer group border border-gray-300 rounded-lg flex items-center justify-center">
        <input type="file" className="hidden" onChange={handleFileChange} />
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="NFT Preview"
            fill
            className="object-cover rounded-lg shadow group-hover:opacity-70 transition-opacity"
          />
        ) : (
          <div className="text-gray-600 text-center">Click to Upload NFT Image</div>
        )}
      </label>

      {/* Name & Description */}
      <input
        type="text"
        placeholder="NFT Name"
        className="w-full p-2 border border-gray-300 rounded-lg"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="NFT Description"
        className="w-full p-2 border border-gray-300 rounded-lg"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Collection Selection */}
      <select
        className="w-full p-2 border border-gray-300 rounded-lg"
        value={selectedCollection || ""}
        onChange={(e) => setSelectedCollection(e.target.value as Hex)}
      >
        <option value="">Select Collection</option>
        {collections.map((collection, index) => (
          <option key={index} value={collection.address}>
            {collection.name} ({collection.address})
          </option>
        ))}
      </select>

      {/* Attributes */}
      <div className="w-full space-y-2">
        <Text variant="h3">Attributes</Text>
        {attributes.map((attr, index) => (
          <div key={index} className="flex space-x-2">
            <input
              type="text"
              placeholder="Trait"
              className="w-1/2 p-2 border border-gray-300 rounded-lg"
              value={attr.trait_type}
              onChange={(e) => handleAttributeChange(index, "trait_type", e.target.value)}
            />
            <input
              type="text"
              placeholder="Value"
              className="w-1/2 p-2 border border-gray-300 rounded-lg"
              value={attr.value}
              onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
            />
          </div>
        ))}
        <Button onClick={handleAddAttribute} variant="secondary">Add Attribute</Button>
      </div>

      {/* Submit Button */}
      <Button onClick={handleCreateNFT} disabled={uploading || isSubmitting}>
        {isSubmitting ? "Creating..." : "Create NFT"}
      </Button>
    </div>
  );
};

export default CreateNFTForm;
