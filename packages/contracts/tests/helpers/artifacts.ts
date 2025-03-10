import { artifacts as hhArtifacts } from "hardhat";
import { XContract } from "../../src/XContract";

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

