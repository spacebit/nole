"use client";

import React, { useState } from "react";
import { assertIsAddress, Hex } from "@nilfoundation/niljs";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Loader from "@/components/ui/Loader";

interface TransferNFTModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (recipient: Hex) => Promise<void>;
}

const TransferNFTModal: React.FC<TransferNFTModalProps> = ({
  isOpen,
  onClose,
  onTransfer,
}) => {
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    message: string;
    status: "loading" | "success" | "error";
  } | null>(null);

  const handleTransfer = async () => {
    try {
      setError("");
      assertIsAddress(recipient);
      setStatusMessage({ message: "Transferring NFT...", status: "loading" });
      setIsSubmitting(true);

      await onTransfer(recipient as Hex);

      setStatusMessage({ message: "NFT Transferred Successfully!", status: "success" });

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch {
      setError("Invalid Ethereum address");
      setStatusMessage({ message: "Transfer failed.", status: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-semibold mb-4">Transfer NFT</h2>
      
      {statusMessage && (
        <Loader message={statusMessage.message} status={statusMessage.status} />
      )}

      <input
        type="text"
        placeholder="Recipient Address"
        className="w-full p-2 border border-gray-300 rounded-lg"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      <div className="flex justify-end mt-4 gap-2">
        <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleTransfer} disabled={isSubmitting}>
          {isSubmitting ? "Transferring..." : "Transfer"}
        </Button>
      </div>
    </Modal>
  );
};

export default TransferNFTModal;
