"use client";

import { useRouter } from "next/navigation";
import CollectionCardsList from "@/components/modules/CollectionCardsList";
import Button from "@/components/ui/Button";
import { useNilWallet } from "@/contexts/NilWalletContext";
import useCollectionRegistryContract from "@/hooks/useCollectionRegistry";
import { Hex } from "@nilfoundation/niljs";
import { useEffect, useState } from "react";
import Text from "@/components/ui/Text";

export default function Home() {
  const router = useRouter();
  const { walletAddress } = useNilWallet();
  const { getCollectionsAmountOf } = useCollectionRegistryContract(
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

  const TODO_MOCK_COLLECTIONS = [
    {
      id: "1",
      imageUrl: "https://orange-impressed-bonobo-853.mypinata.cloud/ipfs/bafybeictiq7irgueukw7hnmmords4bpi5yjnu6s4dzhu3tuht6xa3jbk3y/500.webp",
      title: "Hello",
    },
    {
      id: "2",
      imageUrl: "https://orange-impressed-bonobo-853.mypinata.cloud/ipfs/bafybeictiq7irgueukw7hnmmords4bpi5yjnu6s4dzhu3tuht6xa3jbk3y/250.webp",
      title: "Hello",
    },
  ];

  return (
    <>
      <div className="flex justify-center p-5">
        <Button onClick={() => router.push("/create-collection")}>
          Create a Collection
        </Button>
        <Text variant="p">Collections: {collectionAmount}</Text>
      </div>
      <CollectionCardsList collections={TODO_MOCK_COLLECTIONS} />
    </>
  );
}
