import React, { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Island from "@/components/ui/Island";
import Text from "@/components/ui/Text";
import { NFTMetadataFull } from "@/types/metadata";
import { useUserAssets } from "@/contexts/UserAssetsContext";

interface NFTDetailsProps {
  nft: NFTMetadataFull;
}

const NFTDetails: React.FC<NFTDetailsProps> = ({ nft }) => {
  const { nfts } = useUserAssets();
  const [own, setOwn] = useState(false);

  useEffect(() => {
    if (nfts.find((token) => token.address === nft.address)) {
      setOwn(true);
    }
  }, [nft.address, nfts]);

  return (
    <Island className="flex flex-row items-start gap-8 p-6 md:p-8 w-full">
      {/* NFT Image */}
      <div className="flex-shrink-0 min-w-[300px] w-[40%] max-w-[500px] relative">
        <Image
          src={nft.image}
          alt={nft.name || "NFT Image"}
          layout="responsive"
          width={500}
          height={500}
          objectFit="cover"
          className="rounded-lg border"
        />
      </div>

      {/* Metadata & Actions */}
      <div className="flex flex-col flex-grow">
        {/* Name */}
        {nft.name && (
          <Text variant="h1" className="mb-2">
            {nft.name}
          </Text>
        )}

        {/* Description */}
        {nft.description && (
          <p className="text-gray-600 mb-4">{nft.description}</p>
        )}

        {/* Action Buttons */}
        {own && (
          <div className="mt-4 flex gap-4">
            <Button variant="secondary" disabled>
              Transfer
            </Button>
            <Button variant="danger" disabled>
              Burn
            </Button>
          </div>
        )}

        {/* Attributes Section */}
        {nft.attributes && nft.attributes.length > 0 && (
          <div className="border-t pt-6 mt-6">
            <Text variant="h2" className="mb-4 text-gray-800">
              Attributes
            </Text>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {nft.attributes.map((trait, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-100 border border-gray-300 shadow-sm rounded-lg"
                >
                  <p className="text-xs text-gray-500 uppercase">
                    {trait.trait_type}
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {trait.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Island>
  );
};

export default NFTDetails;
