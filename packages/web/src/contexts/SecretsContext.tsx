// Because there are no wallet extensions we store secrets in the local storage
// All this code should be eliminated in the future

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SecretsContextType {
  privateKey: string;
  walletAddress: string;
  setSecrets: (privateKey: string, walletAddress: string) => void;
  clearSecrets: () => void;
}

const SecretsContext = createContext<SecretsContextType | undefined>(undefined);

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
  const setSecrets = (newPrivateKey: string, newWalletAddress: string) => {
    setPrivateKey(newPrivateKey);
    setWalletAddress(newWalletAddress);
    localStorage.setItem('wallet_private_key', newPrivateKey);
    localStorage.setItem('wallet_address', newWalletAddress);
  };

  // Clear wallet details from state and localStorage.
  const clearSecrets = () => {
    setPrivateKey('');
    setWalletAddress('');
    localStorage.removeItem('wallet_private_key');
    localStorage.removeItem('wallet_address');
  };

  return (
    <SecretsContext.Provider value={{ privateKey, walletAddress, setSecrets, clearSecrets }}>
      {children}
    </SecretsContext.Provider>
  );
};

export const useSecrets = (): SecretsContextType => {
  const context = useContext(SecretsContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
