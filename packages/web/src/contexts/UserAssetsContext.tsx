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
import {
  NFTMetadataOffchain,
  CollectionMetadataFull,
  NFTMetadataFull,
} from "@/types/metadata";

interface UserAssetsContextProps {
  collections: CollectionMetadataFull[];
  collectionsLoading: boolean;
  nfts: NFTMetadataFull[];
  addNFT: (nft: NFTMetadataFull) => void;
  removeNFT: (nft: NFTMetadataFull) => void;
  nftsLoading: boolean;
  fetchNFT: (address: Hex) => Promise<NFTMetadataFull | undefined>;
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
  const [collections, setCollections] = useState<CollectionMetadataFull[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const fetchedCollections = useRef(false);

  const [nfts, setNFTs] = useState<NFTMetadataFull[]>([]);
  const [nftsLoading, setNftsLoading] = useState(true);

  const addNFT = useCallback(
    (nft: NFTMetadataFull) => {
      setNFTs((prevNFTs) => {
        if (prevNFTs.some((t) => t.address === nft.address)) return prevNFTs;
        return [...prevNFTs, nft];
      });
    },
    []
  );

  const removeNFT = useCallback(
    (nft: NFTMetadataFull) => {
      setNFTs((prevNFTs) => [...prevNFTs.filter((t) => t.address !== nft.address)]);
    },
    [setNFTs]
  );  

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

  const fetchNFT = useCallback(
    async (address: Hex) => {
      if (!client) return;

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

        const [metadataOffchain, collectionAddress] = (await Promise.all([
          fetchNFTMetadata(tokenURI),
          nftContract.read.collectionAddress([]),
        ])) as [NFTMetadataOffchain, Hex];

        if (!metadataOffchain) throw Error("Cannot fetch metadata");

        const metadataFull: NFTMetadataFull = {
          ...metadataOffchain,
          tokenURI,
          address,
          collectionAddress,
        };

        return metadataFull;
      }
    },
    [client, fetchNFTMetadata]
  );

  const fetchNFTs = useCallback(async () => {
    if (!walletAddress || !client) return;

    try {
      setNftsLoading(true);
      const tokens: Record<string, bigint> = await client.getTokens(
        walletAddress,
        "latest"
      );
      const nonZeroTokens = Object.entries(tokens).filter(([, value]) => value !== BigInt(0));

      const tokenAddresses = nonZeroTokens.map(([addr]) => addr) as Hex[];

      const supportedNfts: NFTMetadataFull[] = await Promise.all(
        tokenAddresses.map((addr) => fetchNFT(addr))
      ).then((res) => res.filter((v) => !!v));

      setNFTs(supportedNfts);
    } catch (error) {
      console.error("❌ Error fetching user tokens:", error);
    } finally {
      setNftsLoading(false);
    }
  }, [client, fetchNFT, walletAddress]);

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
        const collectionsObj: CollectionMetadataFull[] = [];

        for (const address of collectionAddresses) {
          const collectionContract = getContract({
            client,
            abi: artifacts.collection.abi,
            address,
          });

          const [contractURI, symbol] = (await Promise.all([
            collectionContract.read.contractURI([]),
            collectionContract.read.symbol([]),
          ])) as [string, string];

          // Off-chain metadata
          const metadata = await fetchCollectionMetadata(contractURI);
          if (!metadata) throw Error("Cannot fetch metadata");

          // + on-chain metadata
          const fullMetadata: CollectionMetadataFull = {
            ...metadata,
            contractURI,
            symbol,
            address,
          };

          collectionsObj.push(fullMetadata);
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
      addNFT,
      removeNFT,
      nftsLoading,
      fetchNFT,
      fetchNFTs,
      fetchUserCollections,
    }),
    [
      collections,
      collectionsLoading,
      nfts,
      addNFT,
      removeNFT,
      nftsLoading,
      fetchNFT,
      fetchNFTs,
      fetchUserCollections,
    ]
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
