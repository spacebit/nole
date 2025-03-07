"use client";

import React, { useState } from "react";
import { assertIsAddress, Hex } from "@nilfoundation/niljs";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import { useLoader } from "@/contexts/LoaderContext";

interface TransferNFTModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (recipient: Hex) => Promise<void>;
}

const TransferNFTModal: React.FC<TransferNFTModalProps> = ({ isOpen, onClose, onTransfer }) => {
  const { showLoader, hideLoader } = useLoader();
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTransfer = async () => {
    try {
      setError("");
      assertIsAddress(recipient);
      showLoader("Transferring NFT...", "loading");
      setIsSubmitting(true);

      await onTransfer(recipient as Hex);

      showLoader("NFT Transferred Successfully!", "success");

      setTimeout(() => {
        onClose();
        hideLoader();
      }, 2000);
    } catch {
      setError("Invalid Ethereum address");
      showLoader("Transfer failed.", "error");
      setTimeout(hideLoader, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Text variant="h3" className="mb-4">Transfer NFT</Text>

      <Input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        error={error}
      />

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
