import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { HttpTransport, PublicClient } from "@nilfoundation/niljs";

interface NilClientContextType {
  client: PublicClient | undefined;
}

const NilClientContext = createContext<NilClientContextType | undefined>(
  undefined
);

export const NilClientProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [client, setClient] = useState<PublicClient | undefined>(undefined);

  const clientInstance = useMemo(() => {
    return new PublicClient({
      transport: new HttpTransport({
        endpoint: process.env.NEXT_PUBLIC_RPC!,
      }),
      shardId: 1,
    });
  }, []);

  useEffect(() => {
    setClient((prev) => prev ?? clientInstance);
  }, [clientInstance]);

  return (
    <NilClientContext.Provider value={{ client }}>
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
