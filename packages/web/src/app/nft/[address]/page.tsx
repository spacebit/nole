"use client";

import { useParams, notFound } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useUserAssets } from "@/contexts/UserAssetsContext";
import NFTDetails from "@/components/modules/NFTDetails";
import { NFTMetadataFull } from "@/types/metadata";
import { Hex } from "@nilfoundation/niljs";

export default function NFTPage() {
  const params = useParams<{ address: Hex }>();
  const { nfts, fetchNFT } = useUserAssets();
  const [nft, setNFT] = useState<NFTMetadataFull | null>(null);

  const selectedNft = useMemo(
    () => nfts.find((n) => n.address === params.address),
    [nfts, params.address]
  );

  useEffect(() => {
    if (!params.address || nft) return;

    const fetchAndSetNFT = async () => {
      try {
        if (selectedNft) {
          setNFT(selectedNft);
        } else {
          const fetchedNft = await fetchNFT(params.address);
          if (!fetchedNft) notFound();
          setNFT(fetchedNft);
        }
      } catch {
        notFound();
      }
    };

    fetchAndSetNFT();
  }, [params.address, selectedNft, fetchNFT, nft]);

  if (!nft) return null;

  return (
    <div className="flex justify-center p-10">
      <NFTDetails nft={nft} />
    </div>
  );
}
