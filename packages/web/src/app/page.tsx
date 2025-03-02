"use client";

import Header from "@/components/modules/Header";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import { useNilWallet } from "@/contexts/NilWalletContext";
import useCollectionRegistryContract from "@/hooks/useCollectionRegistry";
import { Hex } from "@nilfoundation/niljs";
import { useEffect, useState } from "react";

export default function Home() {
  const { walletAddress } = useNilWallet();
  const { getCollectionsAmountOf, createCollection } = useCollectionRegistryContract(
    process.env.NEXT_PUBLIC_REGISTRY_ADDRESS! as Hex
  );
  const [collectionAmount, setCollectionAmount] = useState<bigint | null>(null);

  useEffect(() => {
    const fetch = async () => {
      if (!walletAddress) return;
      const amount = await getCollectionsAmountOf(walletAddress);
      if (amount !== null) {
        setCollectionAmount(amount);
      }
    };

    fetch();
  }, [getCollectionsAmountOf, walletAddress]);



  return (
    <>
      <Header />
      <Text variant="h1">Welcome to Nole</Text>
      {walletAddress && <Text variant="h3">{walletAddress}</Text>}
      <Text variant="h3">COLLECTIONS: {collectionAmount}</Text>
      <Button onClick={() => createCollection("Col", "COL")}>Create a collections</Button>
    </>
  );
}
