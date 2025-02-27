// This component should be removed when the wallet extension will be stable
"use client";

import React, { useState } from "react";
import Button from "../ui/Button";
import Modal from "./Modal";
import WalletForm from "./WalletForm";
import { useSecrets } from "../../contexts/SecretsContext";
import { shortenAddress } from "@/lib/utils";

const ConnectButtonCustom: React.FC = () => {
  const { walletAddress } = useSecrets();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <Button onClick={handleOpenModal}>
        {walletAddress ? shortenAddress(walletAddress) : 'Connect Wallet'}
      </Button>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Connect your =nil; wallet">
        <WalletForm onClose={handleCloseModal} />
      </Modal>
    </>
  );
};

export default ConnectButtonCustom;