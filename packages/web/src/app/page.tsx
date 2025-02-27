"use client";

import Header from "@/components/modules/Header";
import Text from "@/components/ui/Text";
import { useNil } from "@/contexts/NilContext";
import { useEffect, useState } from "react";

export default function Home() {
  const [balance, setBalance] = useState<bigint | undefined>(undefined);
  const { account, client } = useNil();

  useEffect(() => {
    const fetchBalance = async () => {
      if (!account) return;
      const currentBalance = await account.client.getBalance(account.address);

      setBalance(currentBalance);
    };

    fetchBalance();
  }, [account, client]);

  return (
    <>
      <Header />
      <Text variant="h1">Welcome to the Nole</Text>
      {account && <Text variant="h3">{account.address}</Text>}
      {balance && <Text variant="p">Your balance is ${balance}</Text>}
    </>
  );
}
