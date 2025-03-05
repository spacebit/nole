"use client";

import React from "react";
import Button from "../ui/Button";
import { shortenAddress } from "@/lib/utils";
import { useNilWallet } from "@/contexts/NilWalletContext";
import Link from "next/link";
import { LogOut } from "lucide-react";

const ConnectButton: React.FC = () => {
  const { walletInstalled, walletAddress, connectWallet, disconnectWallet } = useNilWallet();

  if (!walletInstalled()) {
    return (
      <Button>
        <Link
          href="https://chromewebstore.google.com/detail/nil-wallet/kfiailmjchdbjmadbkkldiahpggcjffp?hl=en&authuser=1"
          target="_blank"
        >
          Install wallet
        </Link>
      </Button>
    );
  }

  return (
    <Button variant={walletAddress ? "secondary" : "primary"} onClick={walletAddress ? disconnectWallet : connectWallet}>
      {walletAddress ? (
        <span className="flex items-center gap-2">
          {shortenAddress(walletAddress)}
          <LogOut size={16} />
        </span>
      ) : (
        "Connect Wallet"
      )}
    </Button>
  );
};

export default ConnectButton;
