"use client";

import { useRouter } from "next/navigation";
import CardsList from "@/components/modules/CardsList";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import { useNilWallet } from "@/contexts/NilWalletContext";
import { useUserAssets } from "@/contexts/UserAssetsContext";
import Placeholder from "@/components/modules/Placeholder";

export default function Home() {
  const router = useRouter();
  const { walletAddress } = useNilWallet();
  const { collections, collectionsLoading } = useUserAssets();

  return (
    <>
      {walletAddress && (
        <div className="flex justify-center p-5">
          <div className="m-3">
            <div className="flex gap-4">
              <Button onClick={() => router.push("/create-collection")}>
                Create a Collection
              </Button>
              <Button onClick={() => router.push("/create-nft")}>
                Create NFT
              </Button>
            </div>
          </div>
        </div>
      )}

      {collectionsLoading ? (
        <CardsList cards={[]} loading={true} />
      ) : !walletAddress ? (
        <Placeholder message="Nothing here" action="Connect your wallet" />
      ) : collections.length === 0 ? (
        <Placeholder message="Nothing here" action="Create something" />
      ) : (
        <div className="flex flex-col items-center justify-center p-5 text-center">
          <Text variant="h2" className="mb-4">
            Collections
          </Text>
          <CardsList cards={collections} loading={false} />
        </div>
      )}
    </>
  );
}
