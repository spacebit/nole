"use client";

import { Hex } from "@nilfoundation/niljs";
import React, { createContext, useContext, useState } from "react";

interface NilWalletContextType {
  walletAddress: Hex | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  sendTransaction: (to: string, value: number) => Promise<string | null>;
  walletInstalled: () => boolean;
}

const NilWalletContext = createContext<NilWalletContextType | undefined>(
  undefined
);

export const NilWalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [walletAddress, setWalletAddress] = useState<Hex | null>(null);

  const walletInstalled = () => {
    return typeof window !== "undefined" && window.nil ? true : false;
  };

  const connectWallet = async () => {
    if (typeof window !== "undefined" && window.nil) {
      try {
        const accounts = await window.nil.request({
          method: "eth_requestAccounts",
        });
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
          console.log("✅ Wallet connected:", accounts[0]);
        }
      } catch (error) {
        console.error("❌ Failed to connect wallet:", error);
      }
    } else {
      console.error(
        "❌ =nil; Wallet Extension not found. Install the extension."
      );
    }
  };

  const disconnectWallet = () => {
    if (walletAddress) {
      setWalletAddress(null);
    }
  };

  const sendTransaction = async (
    to: string,
    value: number
  ): Promise<string | null> => {
    if (!walletAddress) {
      console.error("❌ No wallet connected. Please connect first.");
      return null;
    }

    const tx = { to, value };

    try {
      const txHash = await window.nil?.request({
        method: "eth_sendTransaction",
        params: [tx],
      });
      console.log("✅ Transaction sent:", txHash);
      return txHash;
    } catch (error) {
      console.error("❌ Failed to send transaction:", error);
      return null;
    }
  };

  return (
    <NilWalletContext.Provider
      value={{
        walletAddress,
        connectWallet,
        disconnectWallet,
        sendTransaction,
        walletInstalled,
      }}
    >
      {children}
    </NilWalletContext.Provider>
  );
};

export const useNilWallet = (): NilWalletContextType => {
  const context = useContext(NilWalletContext);
  if (!context) {
    throw new Error("useNilWallet must be used within a NilWalletProvider");
  }
  return context;
};
