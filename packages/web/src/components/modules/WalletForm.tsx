"use client";

import { useSecrets } from "@/contexts/SecretsContext";
import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";

export interface WalletFormProps {
  onClose?: () => void;
}

const WalletForm: React.FC<WalletFormProps> = ({ onClose }) => {
  const {
    privateKey: contextKey,
    walletAddress: contextAddress,
    setSecrets,
    clearSecrets,
  } = useSecrets();
  const [privateKey, setPrivateKeyState] = useState("");
  const [walletAddress, setWalletAddressState] = useState("");

  useEffect(() => {
    if (contextKey) setPrivateKeyState(contextKey);
    if (contextAddress) setWalletAddressState(contextAddress);
  }, [contextKey, contextAddress]);

  const handleSave = () => {
    if (privateKey && walletAddress) {
      setSecrets(privateKey, walletAddress);
      if (onClose) onClose();
    }
  };

  const handleForget = () => {
    setPrivateKeyState("");
    setWalletAddressState("");
    clearSecrets();
    if (onClose) onClose();
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-md shadow-sm space-y-4">
      <Input
        label="Private Key"
        value={privateKey}
        onChange={(e) => setPrivateKeyState(e.target.value)}
        placeholder="Enter your private key"
      />
      <Input
        label="Wallet Address"
        value={walletAddress}
        onChange={(e) => setWalletAddressState(e.target.value)}
        placeholder="Enter your wallet address"
      />
      <div className="flex space-x-4">
        <Button onClick={handleSave} disabled={!privateKey || !walletAddress}>
          Save
        </Button>
        <Button onClick={handleForget} variant="danger">
          Forget
        </Button>
      </div>
    </div>
  );
};

export default WalletForm;
