"use client";

import { useRouter } from "next/navigation";
import CardsList from "@/components/modules/CardsList";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import { useNilWallet } from "@/contexts/NilWalletContext";
import { useUserAssets } from "@/contexts/UserAssetsContext";
import Placeholder from "@/components/modules/Placeholder";
import Island from "@/components/ui/Island";

export default function Home() {
  const router = useRouter();
  const { walletAddress } = useNilWallet();
  const { collections, collectionsLoading, nfts, nftsLoading } = useUserAssets();

  if (!walletAddress) {
    return <Placeholder message="Nothing here" action="Connect your wallet" />;
  }

  return (
    <>
      {/* Top Action Buttons */}
      <div className="flex p-5">
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

      <div className="flex flex-row gap-4 p-5">
        {(collectionsLoading || collections.length > 0) && (
          <Island className="w-64 flex-shrink-0">
            <div className="flex flex-col items-center text-center">
              <Text variant="h2" className="mb-4">
                Collections
              </Text>
              <CardsList cards={collections} loading={collectionsLoading} variant="small" />
            </div>
          </Island>
        )}

        <Island className="flex-1">
          {nftsLoading ? (
            <CardsList cards={[]} loading={true} variant="large" />
          ) : nfts.length > 0 ? (
            <div className="flex flex-col items-center text-center">
              <Text variant="h2" className="mb-4">
                Your NFTs
              </Text>
              <CardsList cards={nfts} loading={false} variant="large" />
            </div>
          ) : (
            <Placeholder message="No NFTs found" action="Create NFT" />
          )}
        </Island>
      </div>
    </>
  );
}
