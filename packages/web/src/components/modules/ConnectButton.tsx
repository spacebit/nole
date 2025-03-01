"use client";

import React from "react";
import Button from "../ui/Button";
import { shortenAddress } from "@/lib/utils";
import { useNilWallet } from "@/contexts/NilWalletContext";
import Link from "next/link";

const ConnectButton: React.FC = () => {
  const { walletInstalled, walletAddress, connectWallet, disconnectWallet } =
    useNilWallet();

  return (
    <>
      {!walletInstalled() ? (
        <Button>
          <Link
            href="https://chromewebstore.google.com/detail/nil-wallet/kfiailmjchdbjmadbkkldiahpggcjffp?hl=en&authuser=1"
            target="_blank"
          >
            Install wallet
          </Link>
        </Button>
      ) : (
        <Button
          variant={walletAddress ? "danger" : "primary"}
          onClick={walletAddress ? disconnectWallet : connectWallet}
        >
          {walletAddress ? shortenAddress(walletAddress) : "Connect Wallet"}
        </Button>
      )}
    </>
  );
};

export default ConnectButton;
