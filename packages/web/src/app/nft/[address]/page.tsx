"use client";

import { useUserAssets } from "@/contexts/UserAssetsContext";
import { NFTMetadataFull } from "@/types/metadata";
import { Hex } from "@nilfoundation/niljs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TokenPage() {
  const params = useParams<{ address: Hex }>();
  const { nfts, fetchNFT } = useUserAssets();
  const [nft, setNFT] = useState<NFTMetadataFull | null>(null);

  useEffect(() => {
    const setNFTCard = async () => {
      const nft = nfts.find((token) => token.address === params.address);

      try {
        if (nft) {
          setNFT(nft);
        } else {
          const nft = await fetchNFT(params.address);
          if (!nft) throw Error("NFT not found")
          setNFT(nft);
        }
      } catch {
        // TODO
      }
    }

    setNFTCard();
  }, [fetchNFT, nfts, params.address]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Token Page</h1>
      {nft ? (
        <pre className="bg-gray-100 p-4 mt-4 rounded-md text-sm">
          {JSON.stringify(nft, null, 2)}
        </pre>
      ) : (
        <p className="mt-4 text-lg font-semibold">
          Token Address: {params.address}
        </p>
      )}
    </div>
  );
}
