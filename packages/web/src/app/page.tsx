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
  const { collections, collectionsLoading, nfts, nftsLoading } =
    useUserAssets();

  if (!walletAddress) {
    return <Placeholder message="Nothing yet" action="Connect your wallet" />;
  }

  return (
    <div>
      {/* Top Action Buttons */}
      <div className="flex p-5">
        <div className="m-3">
          <div className="flex gap-4">
            <Button onClick={() => router.push("/create-collection")}>
              Create a Collection
            </Button>
            <Button
              onClick={() => router.push("/create-nft")}
              disabled={collectionsLoading || collections.length === 0}
            >
              Create NFT
            </Button>
          </div>
        </div>
      </div>

      {/* Collections */}
      <div className="flex flex-row gap-4 p-5">
        {(collectionsLoading || collections.length > 0) && (
          <Island className="w-64 flex-shrink-0">
            <div className="flex flex-col items-center text-center">
              <Text variant="h2" className="mb-4">
                Collections
              </Text>
              <CardsList
                cards={collections}
                loading={collectionsLoading}
                variant="small"
                onCardClick={console.log}
              />
            </div>
          </Island>
        )}

        {/* NFTs */}
        <Island className="flex-1">
          {nftsLoading ? (
            <CardsList cards={[]} loading={true} variant="large" />
          ) : nfts.length > 0 ? (
            <div className="flex flex-col items-center text-center">
              <Text variant="h2" className="mb-4">
                Your NFTs
              </Text>
              <CardsList cards={nfts} loading={false} variant="large" onCardClick={(card) => router.push(`/nft/${card.address}`)} />
            </div>
          ) : (
            <Placeholder message="No NFTs found" action="Create one" />
          )}
        </Island>
      </div>
    </div>
  );
}
