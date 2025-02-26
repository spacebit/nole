// Because there are no wallet extensions we store secrets in the local storage
// This file should be eliminated in the future

import React, { createContext, useContext, useState, useEffect } from 'react';

interface WalletContextType {
  privateKey: string;
  walletAddress: string;
  setWallet: (privateKey: string, walletAddress: string) => void;
  clearWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [privateKey, setPrivateKey] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  // On mount, restore wallet details from localStorage.
  useEffect(() => {
    const storedPrivateKey = localStorage.getItem('wallet_private_key');
    const storedWalletAddress = localStorage.getItem('wallet_address');
    if (storedPrivateKey) {
      setPrivateKey(storedPrivateKey);
    }
    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress);
    }
  }, []);

  // Update state and localStorage with wallet details.
  const setWallet = (newPrivateKey: string, newWalletAddress: string) => {
    setPrivateKey(newPrivateKey);
    setWalletAddress(newWalletAddress);
    localStorage.setItem('wallet_private_key', newPrivateKey);
    localStorage.setItem('wallet_address', newWalletAddress);
  };

  // Clear wallet details from state and localStorage.
  const clearWallet = () => {
    setPrivateKey('');
    setWalletAddress('');
    localStorage.removeItem('wallet_private_key');
    localStorage.removeItem('wallet_address');
  };

  return (
    <WalletContext.Provider value={{ privateKey, walletAddress, setWallet, clearWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
