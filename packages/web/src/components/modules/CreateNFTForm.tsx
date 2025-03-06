"use client";

import React, { useState } from "react";
import { usePinata } from "@/contexts/PinataContext";
import { useUserAssets } from "@/contexts/UserAssetsContext";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import useCollectionContract from "@/hooks/useCollectionContract";
import { Hex } from "@nilfoundation/niljs";
import { useLoader } from "@/contexts/LoaderContext";
import { FaTrash } from "react-icons/fa";

const CreateNFTForm: React.FC = () => {
  const { uploadFile, uploadMetadata, uploading } = usePinata();
  const { collections, fetchNFTs } = useUserAssets();
  const { showLoader, hideLoader } = useLoader();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<Hex | null>(null);
  const [attributes, setAttributes] = useState<{ trait_type: string; value: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const collectionContract = useCollectionContract(selectedCollection as Hex);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0];
      e.target.value = "";
      setFile(newFile);
      setPreviewUrl(URL.createObjectURL(newFile));
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

  const handleRemoveAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleCreateNFT = async () => {
    showLoader("Uploading NFT...", "loading");
    setIsSubmitting(true);

    if (!file || !name.trim() || !description.trim() || !selectedCollection) {
      showLoader("Please fill out all fields and upload an image.", "error");
      setTimeout(hideLoader, 5000);
      setIsSubmitting(false);
      return;
    }

    if (attributes.length > 0 && attributes.some((attr) => !attr.trait_type.trim() || !attr.value.trim())) {
      showLoader("All attribute fields must be filled.", "error");
      setTimeout(hideLoader, 5000);
      setIsSubmitting(false);
      return;
    }

    try {
      const imageUrl = await uploadFile(file);
      if (!imageUrl) {
        showLoader("Image upload failed.", "error");
        setTimeout(hideLoader, 5000);
        setIsSubmitting(false);
        return;
      }

      const metadata = { name, description, image: imageUrl, attributes };
      const metadataUrl = await uploadMetadata(metadata);
      if (!metadataUrl) {
        showLoader("Metadata upload failed.", "error");
        setTimeout(hideLoader, 5000);
        setIsSubmitting(false);
        return;
      }

      const tokenId = BigInt(Date.now());
      const mintTx = await collectionContract.mintNFT(selectedCollection as Hex, tokenId, metadataUrl);

      if (mintTx) {
        showLoader("NFT created successfully!", "success");
        fetchNFTs();
      } else {
        showLoader("Transaction failed.", "error");
      }

      // Reset form
      setFile(null);
      setPreviewUrl(null);
      setName("");
      setDescription("");
      setSelectedCollection(null);
      setAttributes([]);
    } catch {
      showLoader("Something went wrong.", "error");
    } finally {
      setIsSubmitting(false);
      setTimeout(hideLoader, 5000);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6 bg-white rounded-xl shadow-lg w-full max-w-md">
      <Text variant="h1">Create new NFT</Text>

      {/* Image Upload */}
      <label className="relative w-[300px] h-[300px] cursor-pointer group border border-gray-300 rounded-lg flex items-center justify-center">
        <input type="file" className="hidden" onChange={handleFileChange} />
        {previewUrl ? (
          <Image src={previewUrl} alt="NFT Preview" fill className="object-cover rounded-lg shadow group-hover:opacity-70 transition-opacity" />
        ) : (
          <div className="text-gray-600 text-center">Click to Upload NFT Image</div>
        )}
      </label>

      {/* Name & Description */}
      <input type="text" placeholder="NFT Name" className="w-full p-2 border border-gray-300 rounded-lg" value={name} onChange={(e) => setName(e.target.value)} />
      <textarea placeholder="NFT Description" className="w-full p-2 border border-gray-300 rounded-lg" value={description} onChange={(e) => setDescription(e.target.value)} />

      {/* Collection Selection */}
      <select className="w-full p-2 border border-gray-300 rounded-lg" value={selectedCollection || ""} onChange={(e) => setSelectedCollection(e.target.value as Hex)}>
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
          <div key={index} className="flex space-x-2 items-center">
            <input type="text" placeholder="Trait" className="w-1/2 p-2 border border-gray-300 rounded-lg" value={attr.trait_type} onChange={(e) => handleAttributeChange(index, "trait_type", e.target.value)} />
            <input type="text" placeholder="Value" className="w-1/2 p-2 border border-gray-300 rounded-lg" value={attr.value} onChange={(e) => handleAttributeChange(index, "value", e.target.value)} />
            <button onClick={() => handleRemoveAttribute(index)} className="p-2 text-black-400 hover:text-black-800">
              <FaTrash size={16} />
            </button>
          </div>
        ))}
        <Button onClick={handleAddAttribute} variant="secondary">
          Add Attribute
        </Button>
      </div>

      {/* Submit Button */}
      <Button onClick={handleCreateNFT} disabled={uploading || isSubmitting}>
        {isSubmitting ? "Creating..." : "Create NFT"}
      </Button>
    </div>
  );
};

export default CreateNFTForm;
