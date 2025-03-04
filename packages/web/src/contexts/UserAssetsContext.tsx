"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useNilWallet } from "@/contexts/NilWalletContext";
import useCollectionRegistryContract from "@/hooks/useCollectionRegistry";
import { getContract, Hex } from "@nilfoundation/niljs";
import { useNil } from "@/contexts/NilContext";
import { artifacts } from "@/lib/artifacts";
import { usePinata } from "@/contexts/PinataContext";
import { CardItem } from "@/types/card";
import { INFT_INTERFACE_ID } from "@/lib/constants";

interface UserAssetsContextProps {
  collections: CardItem[];
  collectionsLoading: boolean;
  walletNFTs: CardItem[];
  nftsLoading: boolean;
}

const UserAssetsContext = createContext<UserAssetsContextProps | undefined>(
  undefined
);

export const UserAssetsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { walletAddress } = useNilWallet();
  const { getCollectionsOf } = useCollectionRegistryContract(
    process.env.NEXT_PUBLIC_REGISTRY_ADDRESS! as Hex
  );
  const { fetchMetadata } = usePinata();
  const { client } = useNil();

  const [collectionAddresses, setCollectionAddresses] = useState<Hex[]>([]);
  const [collections, setCollections] = useState<CardItem[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const fetchedCollections = useRef(false);

  const [walletNFTs, setWalletNFTs] = useState<CardItem[]>([]);
  const [nftsLoading, setNftsLoading] = useState(true);

  /**
   * Fetch tokens owned by the user and check which ones support INFT
   */
  useEffect(() => {
    const fetchTokens = async () => {
      if (!walletAddress || !client) return;

      try {
        setNftsLoading(true);
        const tokens: Record<string, bigint> = await client.getTokens(
          walletAddress,
          "latest"
        );
        const tokenAddresses = Object.keys(tokens);

        const supportedNfts = [];

        for (const address of tokenAddresses) {
          const nftContract = getContract({
            client: client!,
            abi: artifacts.nft.abi,
            address: address as Hex,
          });

          const isINFT = await nftContract.read.supportsInterface([INFT_INTERFACE_ID])
          if (isINFT) {
            const tokenURI = await nftContract.read.tokenURI([]) as string;
            const metadata = await fetchMetadata(tokenURI);
            if (!metadata) throw Error("Cannot fetch metadata");

            supportedNfts.push({
              name: metadata.name,
              imageUrl: metadata.image,
            });
          }
        }

        setWalletNFTs(supportedNfts);
      } catch (error) {
        console.error("❌ Error fetching user tokens:", error);
      } finally {
        setNftsLoading(false);
      }
    };

    fetchTokens();
  }, [client, fetchMetadata, walletAddress]);

  /**
   * Fetch collections owned by the user
   */
  useEffect(() => {
    const fetchCollections = async () => {
      if (!walletAddress) return;
      const userCollections = await getCollectionsOf(walletAddress);
      setCollectionAddresses(userCollections || []);
    };

    fetchCollections();
  }, [walletAddress, getCollectionsOf]);

  /**
   * Fetch metadata for collections
   */
  useEffect(() => {
    const fetchCollectionsInfo = async () => {
      if (fetchedCollections.current || collectionAddresses.length === 0) {
        setCollectionsLoading(false);
        return;
      }

      setCollectionsLoading(true);

      try {
        const collectionsObj: CardItem[] = [];

        for (const address of collectionAddresses) {
          const collectionContract = getContract({
            client: client!,
            abi: artifacts.collection.abi,
            address,
          });

          const contractUri = (await collectionContract.read.contractURI(
            []
          )) as string;
          const metadata = await fetchMetadata(contractUri);
          if (!metadata) throw Error("Cannot fetch metadata");

          collectionsObj.push({
            name: metadata.name,
            imageUrl: metadata.image,
          });
        }

        setCollections(collectionsObj);
        fetchedCollections.current = true;
      } catch (error) {
        console.error("❌ Error fetching collections:", error);
      } finally {
        setCollectionsLoading(false);
      }
    };

    fetchCollectionsInfo();
  }, [client, collectionAddresses, fetchMetadata]);

  return (
    <UserAssetsContext.Provider
      value={{ collections, collectionsLoading, walletNFTs, nftsLoading }}
    >
      {children}
    </UserAssetsContext.Provider>
  );
};

export const useUserAssets = () => {
  const context = useContext(UserAssetsContext);
  if (!context)
    throw new Error("useUserAssets must be used within a UserAssetsProvider");
  return context;
};
