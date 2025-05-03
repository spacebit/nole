"use client";

import React, { useState } from "react";
import Button from "../ui/Button";
import { shortenAddress } from "@/lib/utils";
import { useNilWallet } from "@/contexts/NilWalletContext";
import Link from "next/link";
import { LogOut, Clipboard, ClipboardCheck } from "lucide-react";

const CopyButton: React.FC<{ address: string }> = ({ address }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copyToClipboard}
      className="flex items-center gap-2 px-4 py-2 bg-white text-gray-800 hover:bg-gray-100 transition-all font-medium text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
      aria-label="Copy wallet address"
    >
      <span className="tracking-tight">{shortenAddress(address)}</span>
      {copied ? (
        <ClipboardCheck
          size={16}
          className="text-green-500 transition-opacity duration-300"
        />
      ) : (
        <Clipboard
          size={16}
          className="text-gray-400 transition-opacity duration-300"
        />
      )}
    </button>
  );
};

const ConnectButton: React.FC = () => {
  const { walletInstalled, walletAddress, connectWallet, disconnectWallet } = useNilWallet();

  if (!walletInstalled()) {
    return (
      <Link
        href="https://chromewebstore.google.com/detail/nil-wallet/kfiailmjchdbjmadbkkldiahpggcjffp?hl=en&authuser=1"
        target="_blank"
      >
        <Button variant="primary">Install Wallet</Button>
      </Link>
    );
  }

  return walletAddress ? (
    <div className="flex items-center rounded-lg border border-gray-300 overflow-hidden shadow-sm bg-white">
      <CopyButton address={walletAddress} />
      <button
        onClick={disconnectWallet}
        className="px-3 py-2 border-l border-gray-200 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        aria-label="Disconnect wallet"
      >
        <LogOut size={18} className="text-gray-700" />
      </button>
    </div>
  ) : (
    <Button variant="primary" onClick={connectWallet}>
      Connect Wallet
    </Button>
  );
};

export default ConnectButton;
