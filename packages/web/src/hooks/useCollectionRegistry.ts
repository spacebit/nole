import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getContract,
  Hex,
  PublicClient,
  waitTillCompleted,
} from "@nilfoundation/niljs";
import { useNilWallet } from "../contexts/NilWalletContext";
import { artifacts } from "../lib/artifacts";
import { useNilClient } from "@/contexts/NilClientContext";
import { encodeFunctionData } from "viem";
import { CollectionRegistry$Type } from "../../../contracts/artifacts/contracts/CollectionRegistry.sol/CollectionRegistry";

type CollectionRegistryContract = ReturnType<
  typeof getContract<CollectionRegistry$Type["abi"], PublicClient>
>;

const useCollectionRegistryContract = (registryAddress: Hex) => {
  const { walletAddress } = useNilWallet();
  const { client } = useNilClient();
  const [contract, setContract] = useState<CollectionRegistryContract | null>(
    null
  );

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

  const createCollection = useCallback(
    async (name: string, symbol: string, tokenURI: string) => {
      if (!contract || !walletAddress || !client) return null;
      try {
        const tx = {
          to: registryAddress,
          data: encodeFunctionData({
            functionName: "createCollection",
            args: [name, symbol, tokenURI],
            abi: artifacts.registry.abi,
          }),
        };
        const txHash = await window.nil!.request({
          method: "eth_sendTransaction",
          params: [tx],
        });
        console.log("✅ Collection creation transaction sent:", txHash);
        await waitTillCompleted(client, txHash);
        return txHash;
      } catch (error) {
        console.error("❌ Error creating collection:", error);
        return null;
      }
    },
    [client, contract, registryAddress, walletAddress]
  );

  const getCollectionsOf = useCallback(
    async (owner: Hex) => {
      if (!contract) return null;
      return contract.read.getCollectionsOf([owner]) as `0x${string}`[];
    },
    [contract]
  );

  const getCollectionsAmountOf = useCallback(
    async (owner: Hex) => {
      if (!contract) return null;
      return contract.read.getCollectionsAmountOf([owner]) as bigint;
    },
    [contract]
  );

  return useMemo(() => ({
    createCollection,
    getCollectionsOf,
    getCollectionsAmountOf,
  }), [createCollection, getCollectionsOf, getCollectionsAmountOf]);
};

export default useCollectionRegistryContract;
