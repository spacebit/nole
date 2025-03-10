import { artifacts } from "hardhat";
import { XContract } from "../../src/XContract";
import { XWallet } from "../../src/XWallet";
import { Hex } from "@nilfoundation/niljs";

export const deployCollectionRegistry = async (wallet: XWallet, shardId: number) => {
  const registryArtifacts = await artifacts.readArtifact("CollectionRegistry");
  return XContract.deploy(wallet, registryArtifacts, [], shardId);
}

export const deployCollection = async (registry: Registry, ...collectionArgs: CollectionArgs) => {
  const receipts = await registry.sendTransaction({
    functionName: 'createCollection',
    args: collectionArgs,
  });
  console.log(receipts);
}

export const deployMarket = async (wallet: XWallet, shardId: number) => {
  const marketArtifacts = await artifacts.readArtifact("Market");
  return XContract.deploy(wallet, marketArtifacts, [], shardId);
};

type Registry = Awaited<ReturnType<typeof deployCollectionRegistry>>;

type CollectionArgs = [name: string, symbol: string, _contractURI: string]
