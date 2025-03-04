import React, { createContext, useContext, useEffect, useState } from "react";
import { HttpTransport, PublicClient } from "@nilfoundation/niljs";

interface NilClientContextType {
  client: PublicClient | undefined;
  setClient: (client: PublicClient) => void;
}

const NilClientContext = createContext<NilClientContextType | undefined>(undefined);

const NilClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<PublicClient | undefined>(undefined);

  useEffect(() => {
    const client = new PublicClient({
      transport: new HttpTransport({
        endpoint: process.env.NEXT_PUBLIC_RPC!,
      }),
      shardId: 1,
    });
    setClient(client);
  }, []);

  return (
    <NilClientContext.Provider value={{ client, setClient }}>
      {children}
    </NilClientContext.Provider>
  );
};

export const useNilClient = (): NilClientContextType => {
  const context = useContext(NilClientContext);
  if (!context) {
    throw new Error("useNil must be used within a NilProvider");
  }
  return context;
};

export default NilClientProvider;
