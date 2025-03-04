import {CollectionRegistry$Type} from "../../../contracts/artifacts/contracts/CollectionRegistry.sol/CollectionRegistry";
import {Collection$Type} from "../../../contracts/artifacts/contracts/Collection.sol/Collection";
import {NFT$Type} from "../../../contracts/artifacts/contracts/NFT.sol/NFT";
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
    abi: registryAbi as CollectionRegistry$Type['abi'],
    bytecode: registryBytecode as CollectionRegistry$Type['bytecode'],
  },
  collection: {
    abi: collectionAbi as Collection$Type['abi'],
    bytecode: collectionBytecode as Collection$Type['bytecode'],
  },
  nft: {
    abi: nftAbi as NFT$Type['abi'],
    bytecode: nftBytecode as NFT$Type['bytecode'],
  },
};
