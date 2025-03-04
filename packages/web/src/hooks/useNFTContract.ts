import { useState, useEffect } from "react";
import { getContract, Hex, PublicClient } from "@nilfoundation/niljs";
import { useNilWallet } from "../contexts/NilWalletContext";
import { artifacts } from "../lib/artifacts";
import { useNil } from "@/contexts/NilContext";
import { NFT$Type } from "../../../contracts/artifacts/contracts/NFT.sol/NFT";
import { INFT_INTERFACE_ID } from "@/lib/constants";

type NFTContract = ReturnType<
  typeof getContract<NFT$Type["abi"], PublicClient>
>;

const useNFTContract = (contractAddress: Hex) => {
  const { walletAddress } = useNilWallet();
  const { client } = useNil();
  const [contract, setContract] = useState<NFTContract | null>(null);

  useEffect(() => {
    if (contractAddress && walletAddress) {
      if (!client) {
        console.error("Nil Wallet not found.");
        return;
      }

      const nftContract = getContract({
        client,
        abi: artifacts.nft.abi,
        address: contractAddress,
      });

      setContract(nftContract);
    }
  }, [client, contractAddress, walletAddress]);

  const getName = async () => {
    if (!contract) return null;
    return contract.read.getTokenName([]);
  };

  const getTokenURI = async () => {
    if (!contract) return null;
    return contract.read.tokenURI([]) as Hex;
  };

  const getCollectionAddress = async () => {
    if (!contract) return null;
    return contract.read.collectionAddress([]) as Hex;
  };

  const supportsINFT = async () => {
    if (!contract) return null;
    try {
      return contract.read.supportsInterface([INFT_INTERFACE_ID]) as boolean;
    } catch {
      return false
    }
  };

  return {
    getName,
    getTokenURI,
    getCollectionAddress,
    supportsINFT
  };
};

export default useNFTContract;
