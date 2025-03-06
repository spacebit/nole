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
import { NFT$Type } from "../../../contracts/artifacts/contracts/NFT.sol/NFT";

type NFTContract = ReturnType<
  typeof getContract<NFT$Type["abi"], PublicClient>
>;

const useNFTContract = (nftAddress: Hex) => {
  const { walletAddress } = useNilWallet();
  const { client } = useNilClient();
  const [contract, setContract] = useState<NFTContract | null>(null);

  useEffect(() => {
    if (nftAddress && walletAddress) {
      if (!client) {
        console.error("Nil Wallet not found.");
        return;
      }

      const nftContract = getContract({
        client,
        abi: artifacts.nft.abi,
        address: nftAddress,
      });

      setContract(nftContract);
    }
  }, [client, nftAddress, walletAddress]);

  const transferNFT = useCallback(
    async (to: Hex) => {
      if (!contract || !walletAddress || !client) return null;
      try {
        const tx = {
          to,
          tokens: [{ id: nftAddress, amount: 1 }],
        };
        const txHash: Hex = await window.nil!.request({
          method: "eth_sendTransaction",
          params: [tx],
        });

        console.log("✅ Transfer NFT transaction sent:", txHash);
        await waitTillCompleted(client, txHash);
        return txHash;
      } catch (error) {
        console.error("❌ Error creating collection:", error);
        return null;
      }
    },
    [client, contract, nftAddress, walletAddress]
  );

  return useMemo(
    () => ({
      transferNFT,
    }),
    [transferNFT]
  );
};

export default useNFTContract;
