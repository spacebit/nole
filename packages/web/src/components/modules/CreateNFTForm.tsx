"use client";

import React, { useState } from "react";
import { usePinata } from "@/contexts/PinataContext";
import { useUserAssets } from "@/contexts/UserAssetsContext";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import useCollectionContract from "@/hooks/useCollectionContract";
import { Hex } from "@nilfoundation/niljs";
import { useLoader } from "@/contexts/LoaderContext";
import { FaTrash } from "react-icons/fa";
import FileUploader from "./FileUploader";

const CreateNFTForm: React.FC = () => {
  const { uploadFile, uploadMetadata, uploading } = usePinata();
  const { collections, fetchNFTs } = useUserAssets();
  const { showLoader, hideLoader } = useLoader();

  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<Hex | null>(null);
  const [attributes, setAttributes] = useState<{ trait_type: string; value: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const collectionContract = useCollectionContract(selectedCollection as Hex);

  const handleCreateNFT = async () => {
    showLoader("Uploading NFT...", "loading");
    setIsSubmitting(true);

    if (!file || !name.trim() || !description.trim() || !selectedCollection) {
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

      setFile(null);
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
    <div className="flex flex-col space-y-6 p-6 bg-white rounded-xl shadow-lg w-full max-w-3xl">
      <Text variant="h1">Create new NFT</Text>

      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="w-full md:w-[40%] flex flex-col items-center">
          <FileUploader onFileSelect={setFile} />
        </div>

        <div className="flex flex-col w-full md:w-[60%] space-y-4">
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

          <div className="w-full space-y-2">
            <Text variant="h3">Attributes</Text>
            {attributes.map((attr, index) => (
              <div key={index} className="flex space-x-2 items-center">
                <input
                  type="text"
                  placeholder="Trait"
                  className="w-1/2 p-2 border border-gray-300 rounded-lg"
                  value={attr.trait_type}
                  onChange={(e) => {
                    const updated = [...attributes];
                    updated[index].trait_type = e.target.value;
                    setAttributes(updated);
                  }}
                />
                <input
                  type="text"
                  placeholder="Value"
                  className="w-1/2 p-2 border border-gray-300 rounded-lg"
                  value={attr.value}
                  onChange={(e) => {
                    const updated = [...attributes];
                    updated[index].value = e.target.value;
                    setAttributes(updated);
                  }}
                />
                <button onClick={() => setAttributes(attributes.filter((_, i) => i !== index))} className="p-2 text-gray-500 hover:text-gray-800">
                  <FaTrash size={16} />
                </button>
              </div>
            ))}
            <Button onClick={() => setAttributes([...attributes, { trait_type: "", value: "" }])} variant="secondary">
              Add Attribute
            </Button>
          </div>

          <Button onClick={handleCreateNFT} disabled={uploading || isSubmitting}>
            {isSubmitting ? "Creating..." : "Create NFT"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateNFTForm;
