"use client";

import { Hex } from "@nilfoundation/niljs";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface NilWalletContextType {
  walletAddress: Hex | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  sendTransaction: (to: string, value: number) => Promise<string | null>;
  walletInstalled: () => boolean;
}

const NilWalletContext = createContext<NilWalletContextType | undefined>(undefined);

export const NilWalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<Hex | null>(null);

  // Check if wallet is installed
  const walletInstalled = useCallback(() => {
    return typeof window !== "undefined" && window.nil ? true : false;
  }, []);

  // Connect Wallet & Store State
  const connectWallet = useCallback(async () => {
    if (typeof window !== "undefined" && window.nil) {
      try {
        const accounts = await window.nil.request({
          method: "eth_requestAccounts",
        });
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
          localStorage.setItem("walletConnected", "true"); // Store connection flag
          console.log("✅ Wallet connected:", accounts[0]);
        }
      } catch (error) {
        console.error("❌ Failed to connect wallet:", error);
      }
    } else {
      console.error("❌ =nil; Wallet Extension not found. Install the extension.");
    }
  }, []);

  // Disconnect Wallet
  const disconnectWallet = useCallback(() => {
    if (walletAddress) {
      setWalletAddress(null);
      localStorage.removeItem("walletConnected"); // Remove connection flag
    }
  }, [walletAddress]);

  // Send Transactions
  const sendTransaction = useCallback(
    async (to: string, value: number): Promise<string | null> => {
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
    },
    [walletAddress]
  );

  // Auto-Reconnect Wallet if Previously Connected
  useEffect(() => {
    if (typeof window === "undefined") return;

    const wasConnected = localStorage.getItem("walletConnected");
    if (wasConnected === "true") {
      connectWallet(); // Auto-reconnect if flag exists
    }
  }, [connectWallet]);

  const contextValue = useMemo(
    () => ({
      walletAddress,
      connectWallet,
      disconnectWallet,
      sendTransaction,
      walletInstalled,
    }),
    [walletAddress, connectWallet, disconnectWallet, sendTransaction, walletInstalled]
  );

  return <NilWalletContext.Provider value={contextValue}>{children}</NilWalletContext.Provider>;
};

export const useNilWallet = (): NilWalletContextType => {
  const context = useContext(NilWalletContext);
  if (!context) {
    throw new Error("useNilWallet must be used within a NilWalletProvider");
  }
  return context;
};
