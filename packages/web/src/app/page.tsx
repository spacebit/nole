"use client";

import Header from "@/components/modules/Header";
import Text from "@/components/ui/Text";
import { useNil } from "@/contexts/NilContext";
import { useSecrets } from "@/contexts/SecretsContext";
import { Hex } from "@nilfoundation/niljs";
import { useEffect, useState } from "react";

export default function Home() {
  const [balance, setBalance] = useState<bigint | undefined>(undefined);
  const { client } = useNil();
  const { walletAddress } = useSecrets();

  useEffect(() => {
    const fetchBalance = async () => {
      if (!client || !walletAddress) return;
      const currentBalance = await client.getBalance(walletAddress as Hex);
      console.log(currentBalance);

      setBalance(currentBalance);
    };

    fetchBalance();
  }, [client, walletAddress]);

  return (
    <>
      <Header />
      <Text variant="h1">Welcome to the Nole</Text>
      {balance && <Text variant="p">Your balance is ${balance}</Text>}
    </>
  );
}
