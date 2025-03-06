"use client";

import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserAssets } from "@/contexts/UserAssetsContext";
import NFTDetails from "@/components/modules/NFTDetails";
import { NFTMetadataFull } from "@/types/metadata";
import { Hex } from "@nilfoundation/niljs";

export default function NFTPage() {
  const params = useParams<{ address: Hex }>();
  const { nfts, fetchNFT } = useUserAssets();
  const [nft, setNFT] = useState<NFTMetadataFull | null>(null);

  useEffect(() => {
    const showNFT = async () => {
      try {
        if (!params.address) return;
        const selectedNft = nfts.find((nft) => nft.address === params.address);
        if (selectedNft) {
          setNFT(selectedNft);
        } else {
          const nft = await fetchNFT(params.address);
          if (!nft) notFound();
          setNFT(nft);
        }
      } catch {
        notFound();
      }
    };

    showNFT();
  }, [fetchNFT, nfts, params]);

  if (!nft) return null;

  return (
    <div className="flex justify-center p-10">
      <NFTDetails nft={nft} />
    </div>
  );
}
