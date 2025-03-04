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
  const { collections, collectionsLoading, nfts, nftsLoading } = useUserAssets();

  if (!walletAddress) {
    return <Placeholder message="Nothing here" action="Connect your wallet" />;
  }

  return (
    <>
      {/* Top Action Buttons */}
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

      {/* Islands Container */}
      <div className="flex flex-row gap-4 p-5">
        {/* Collections Island: Only show if loading or collections exist */}
        {(collectionsLoading || collections.length > 0) && (
          <div className="w-64 flex-shrink-0 bg-white shadow-md rounded-lg p-4">
            <div className="flex flex-col items-center text-center">
              <Text variant="h2" className="mb-4">
                Collections
              </Text>
              <CardsList cards={collections} loading={collectionsLoading} variant="small" />
            </div>
          </div>
        )}

        {/* NFTs Island: Takes remaining width */}
        <div className="flex-1 bg-white shadow-md rounded-lg p-4">
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
        </div>
      </div>
    </>
  );
}
