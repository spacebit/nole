import { artifacts as hhArtifacts } from "hardhat";
import { XContract } from "../src/XContract";

const getArtifacts = async () => {
  const [registry, collection, nft, market] = await Promise.all([
    await hhArtifacts.readArtifact("CollectionRegistry"),
    await hhArtifacts.readArtifact("Collection"),
    await hhArtifacts.readArtifact("NFT"),
    await hhArtifacts.readArtifact("Market"),
  ]);

  return { registry, collection, nft, market };
};

export const artifacts = getArtifacts();

export type RegistryXContract = XContract<Awaited<typeof artifacts>['registry']['abi']>;
export type CollectionXContract = XContract<Awaited<typeof artifacts>['collection']['abi']>;
export type NFTXContract = XContract<Awaited<typeof artifacts>['nft']['abi']>;
export type MarketXContract = XContract<Awaited<typeof artifacts>['market']['abi']>;