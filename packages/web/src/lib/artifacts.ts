import { Abi } from "viem";
import {
  abi as collectionAbi,
  bytecode as collectionBytecode,
} from "../../../contracts/artifacts/contracts/Collection.sol/Collection.json";
import {
  abi as registryAbi,
  bytecode as registryBytecode,
} from "../../../contracts/artifacts/contracts/CollectionRegistry.sol/CollectionRegistry.json";
import {
  abi as nftAbi,
  bytecode as nftBytecode,
} from "../../../contracts/artifacts/contracts/NFT.sol/NFT.json";

export const artifacts = {
  registry: {
    abi: registryAbi as Abi,
    bytecode: registryBytecode as `0x${string}`,
  },
  collection: {
    abi: collectionAbi as Abi,
    bytecode: collectionBytecode as `0x${string}`,
  },
  nft: {
    abi: nftAbi as Abi,
    bytecode: nftBytecode as `0x${string}`,
  },
};
