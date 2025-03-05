"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useNilWallet } from "@/contexts/NilWalletContext";
import useCollectionRegistryContract from "@/hooks/useCollectionRegistry";
import { getContract, Hex } from "@nilfoundation/niljs";
import { useNilClient } from "@/contexts/NilClientContext";
import { artifacts } from "@/lib/artifacts";
import { usePinata } from "@/contexts/PinataContext";
import { INFT_INTERFACE_ID } from "@/lib/constants";
import { NFTMetadata, Metadata } from "@/types/metadata";

interface UserAssetsContextProps {
  collections: Metadata[];
  collectionsLoading: boolean;
  nfts: NFTMetadata[];
  nftsLoading: boolean;
  fetchNFTs: () => Promise<void>;
  fetchUserCollections: () => Promise<void>;
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
  const { fetchCollectionMetadata, fetchNFTMetadata } = usePinata();
  const { client } = useNilClient();

  const [collectionAddresses, setCollectionAddresses] = useState<Hex[]>([]);
  const [collections, setCollections] = useState<Metadata[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const fetchedCollections = useRef(false);

  const [nfts, setWalletNFTs] = useState<NFTMetadata[]>([]);
  const [nftsLoading, setNftsLoading] = useState(true);

  const fetchUserCollections = useCallback(async () => {
    if (!walletAddress) return;
  
    setCollectionsLoading(true);
    try {
      const userCollections = await getCollectionsOf(walletAddress);
      setCollectionAddresses(userCollections || []);
      fetchedCollections.current = false;
    } catch (error) {
      console.error("❌ Error fetching user collections:", error);
    } finally {
      setCollectionsLoading(false);
    }
  }, [walletAddress, getCollectionsOf]);

  
  const fetchNFTs = useCallback(async () => {
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
          client,
          abi: artifacts.nft.abi,
          address: address as Hex,
        });

        let isINFT = false;

        try {
          isINFT = (await nftContract.read.supportsInterface([
            INFT_INTERFACE_ID,
          ])) as boolean;
        } catch {}

        if (isINFT) {
          const tokenURI = (await nftContract.read.tokenURI([])) as string;
          const metadata = await fetchNFTMetadata(tokenURI);
          if (!metadata) throw Error("Cannot fetch metadata");

          supportedNfts.push(metadata);
        }
      }

      setWalletNFTs(supportedNfts);
    } catch (error) {
      console.error("❌ Error fetching user tokens:", error);
    } finally {
      setNftsLoading(false);
    }
  }, [client, fetchNFTMetadata, walletAddress]);

  useEffect(() => {
    fetchNFTs();
  }, [client, fetchNFTs, walletAddress]);

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

      if (!client) return;

      setCollectionsLoading(true);

      try {
        const collectionsObj: Metadata[] = [];

        for (const address of collectionAddresses) {
          const collectionContract = getContract({
            client,
            abi: artifacts.collection.abi,
            address,
          });

          const contractUri = (await collectionContract.read.contractURI(
            []
          )) as string;
          const metadata = await fetchCollectionMetadata(contractUri);
          if (!metadata) throw Error("Cannot fetch metadata");

          collectionsObj.push(metadata);
        }

        setCollections(collectionsObj);
        fetchedCollections.current = true;
      } catch (error) {
        console.error("❌ Error fetching collections:", error);
        fetchedCollections.current = true;
      } finally {
        setCollectionsLoading(false);
      }
    };

    fetchCollectionsInfo();
  }, [client, collectionAddresses, fetchCollectionMetadata]);

  const contextValue = useMemo(
    () => ({
      collections,
      collectionsLoading,
      nfts,
      nftsLoading,
      fetchNFTs,
      fetchUserCollections
    }),
    [collections, collectionsLoading, nfts, nftsLoading, fetchNFTs, fetchUserCollections]
  );

  return (
    <UserAssetsContext.Provider value={contextValue}>
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
