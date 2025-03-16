import { Hex } from "@nilfoundation/niljs";
import { XContract } from "../../src/XContract";
import { XWallet } from "../../src/XWallet";
import {
  artifacts,
  CollectionXContract,
  MarketXContract,
  RegistryXContract,
} from "../../utils/artifacts";
import { extractAddressFromLogs } from "../../utils/extract";

export const deployCollectionRegistry = async (
  wallet: XWallet,
  shardId: number
) => {
  const registryArtifacts = (await artifacts).registry;
  return XContract.deploy(wallet, registryArtifacts, [], shardId);
};

export const createCollection = async (
  registry: RegistryXContract,
  ...collectionArgs: CollectionArgs
) => {
  const receipts = await registry.sendTransaction(
    {
      functionName: "createCollection",
      args: collectionArgs,
    },
    { feeCredit: 10n ** 15n }
  );

  const registryReceipt = receipts.find(
    (r) => r.contractAddress === registry.address
  );
  if (!registryReceipt || registryReceipt.success === false)
    throw Error("Cannot find registry receipt");

  const address = extractAddressFromLogs(registryReceipt.logs[0].data);

  return XContract.connect(
    registry.wallet,
    (await artifacts).collection.abi,
    address
  );
};

export const createNFT = async (
  collection: CollectionXContract,
  owner: Hex,
  tokenId: bigint,
  tokenURI = ""
) => {
  const receipts = await collection.sendTransaction(
    {
      functionName: "mint",
      args: [owner, tokenId, tokenURI],
    },
    {
      feeCredit: 10n ** 15n,
    }
  );

  const collectionReceipt = receipts.find(
    (r) => r.contractAddress === collection.address
  );
  if (!collectionReceipt || collectionReceipt.success === false)
    throw Error("Cannot find collection receipt");

  const address = extractAddressFromLogs(collectionReceipt.logs[0].data);

  return XContract.connect(
    collection.wallet,
    (await artifacts).nft.abi,
    address
  );
};

export const deployMarket = async (
  wallet: XWallet,
  shardId: number
): Promise<MarketXContract> => {
  const marketArtifacts = (await artifacts).market;
  return XContract.deploy(wallet, marketArtifacts, [], shardId);
};

type CollectionArgs = [name: string, symbol: string, _contractURI: string];
