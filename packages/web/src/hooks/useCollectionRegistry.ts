import { useState, useEffect } from "react";
import { getContract, Hex } from "@nilfoundation/niljs";
import { useNilWallet } from "../contexts/NilWalletContext";
import {artifacts} from "../lib/artifacts";
import { useNil } from "@/contexts/NilContext";
import { encodeFunctionData } from "viem";

const useCollectionRegistryContract = (registryAddress: Hex) => {
  const { walletAddress } = useNilWallet();
  const { client } = useNil();
  const [contract, setContract] = useState<ReturnType<typeof getContract> | null>(null);

  useEffect(() => {
    if (registryAddress && walletAddress) {
      if (!client) {
        console.error("Nil Wallet not found.");
        return;
      }

      const registryContract = getContract({
        client,
        abi: artifacts.registry.abi,
        address: registryAddress,
      });

      setContract(registryContract);
    }
  }, [client, registryAddress, walletAddress]);

  const createCollection = async (name: string, symbol: string) => {
    if (!contract || !walletAddress) return null;
    try {
      const tx = {
        to: registryAddress,
        data: encodeFunctionData({functionName: "createCollection", args: [name, symbol], abi: artifacts.registry.abi}),
      };
      const txHash = await window.nil!.request({
        method: "eth_sendTransaction",
        params: [tx],
      });
      console.log("✅ Collection creation transaction sent:", txHash);
      return txHash;
    } catch (error) {
      console.error("❌ Error creating collection:", error);
      return null;
    }
  };

  const getCollectionsOf = async (owner: string) => {
    if (!contract) return null;
    return contract.read.getCollectionsOf([owner]);
  };

  const getCollectionsAmountOf = async (owner: string) => {
    if (!contract) return null;
    return contract.read.getCollectionsAmountOf([owner]) as bigint;
  };

  return {
    createCollection,
    getCollectionsOf,
    getCollectionsAmountOf,
  };
};

export default useCollectionRegistryContract;
