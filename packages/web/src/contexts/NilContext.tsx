import React, { createContext, useContext, useEffect, useState } from "react";
import {
  HttpTransport,
  LocalECDSAKeySigner,
  PublicClient,
  SmartAccountV1,
} from "@nilfoundation/niljs";
import { useSecrets } from "./SecretsContext";

interface NilContextType {
  client: PublicClient | undefined;
  setClient: (client: PublicClient) => void;
  account: SmartAccountV1 | undefined;
  setAccount: (account: SmartAccountV1) => void;
}

const NilContext = createContext<NilContextType | undefined>(undefined);

const NilProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { privateKey, walletAddress } = useSecrets();
  const [client, setClient] = useState<PublicClient | undefined>(undefined);
  const [account, setAccount] = useState<SmartAccountV1 | undefined>(undefined);

  useEffect(() => {
    if (!privateKey || !walletAddress) return;
    const client = new PublicClient({
      transport: new HttpTransport({
        endpoint: process.env.NEXT_PUBLIC_RPC!,
      }),
      shardId: 1,
    });

    const signer = new LocalECDSAKeySigner({ privateKey });
    const account = new SmartAccountV1({
      client,
      signer,
      pubkey: signer.getPublicKey(),
      address: walletAddress,
    });

    setClient(client);
    setAccount(account);
  }, [privateKey, walletAddress]);

  return (
    <NilContext.Provider value={{ client, setClient, account, setAccount }}>
      {children}
    </NilContext.Provider>
  );
};

export const useNil = (): NilContextType => {
  const context = useContext(NilContext);
  if (!context) {
    throw new Error("useNil must be used within a NilProvider");
  }
  return context;
};

export default NilProvider;
