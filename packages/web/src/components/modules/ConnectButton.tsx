"use client";

import React, { useState } from "react";
import Button from "../ui/Button";
import { shortenAddress } from "@/lib/utils";
import { useNilWallet } from "@/contexts/NilWalletContext";
import Link from "next/link";
import { LogOut, Clipboard, ClipboardCheck } from "lucide-react";

const ConnectButton: React.FC = () => {
  const { walletInstalled, walletAddress, connectWallet, disconnectWallet } =
    useNilWallet();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!walletInstalled()) {
    return (
      <Button variant="primary">
        <Link
          href="https://chromewebstore.google.com/detail/nil-wallet/kfiailmjchdbjmadbkkldiahpggcjffp?hl=en&authuser=1"
          target="_blank"
        >
          Install wallet
        </Link>
      </Button>
    );
  }

  return walletAddress ? (
    <div className="flex items-center border border-black rounded-md overflow-hidden">
      <button
        onClick={copyToClipboard}
        className="flex items-center gap-2 px-4 py-2 bg-transparent text-black font-bold hover:bg-gray-100 transition"
      >
        {shortenAddress(walletAddress)}
        {copied ? (
          <ClipboardCheck size={16} className="text-green-500" />
        ) : (
          <Clipboard size={16} className="text-gray-600" />
        )}
      </button>

      {/* Logout Button (Connected) */}
      <button
        onClick={disconnectWallet}
        className="px-3 py-2 bg-transparent border-l border-black hover:bg-gray-100 transition"
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
