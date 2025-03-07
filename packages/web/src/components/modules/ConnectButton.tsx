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
      className="flex items-center gap-2 px-4 py-2 bg-transparent text-black font-bold hover:bg-gray-100 transition"
      aria-label="Copy wallet address"
    >
      {shortenAddress(address)}
      {copied ? (
        <ClipboardCheck size={16} className="text-green-500" />
      ) : (
        <Clipboard size={16} className="text-gray-600" />
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
        <Button variant="primary">Install wallet</Button>
      </Link>
    );
  }

  return walletAddress ? (
    <div className="flex items-center border border-black rounded-md overflow-hidden">
      <CopyButton address={walletAddress} />
      <button
        onClick={disconnectWallet}
        className="px-3 py-2 bg-transparent border-l border-black hover:bg-gray-100 transition"
        aria-label="Disconnect wallet"
      >
        <LogOut size={18} className="text-gray-800" />
      </button>
    </div>
  ) : (
    <Button variant="primary" onClick={connectWallet}>
      Connect Wallet
    </Button>
  );
};

export default ConnectButton;
