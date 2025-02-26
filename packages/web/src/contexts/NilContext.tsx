import React, { createContext, useContext, useEffect, useState } from "react";
import { HttpTransport, PublicClient } from "@nilfoundation/niljs";
// import { useSecrets } from "./SecretsContext";
import { config } from "@/lib/config";

interface NilContextType {
  client: PublicClient | undefined;
  setClient: (client: PublicClient) => void;
}

const NilContext = createContext<NilContextType | undefined>(undefined);

const NilProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const { privateKey, walletAddress } = useSecrets();
  const [client, setClient] = useState<PublicClient | undefined>(undefined);

  useEffect(() => {
    const client = new PublicClient({
      transport: new HttpTransport({
        endpoint: config.rpc,
      }),
      shardId: 1,
    });

    setClient(client);
  }, []);

  return (
    <NilContext.Provider value={{ client, setClient }}>
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
