import { expect } from "chai";
import { it } from "mocha";
import { artifacts } from "hardhat";
import {
  PublicClient,
  LocalECDSAKeySigner,
  HttpTransport,
  SmartAccountV1,
  waitTillCompleted,
} from "@nilfoundation/niljs";
import config from "../utils/config";
import {
  abi as collectionAbi,
  bytecode as collectionBytecode,
} from "../artifacts/contracts/Collection.sol/Collection.json";
import { XWallet } from "../src/XWallet";
import { XContract } from "../src/XContract";
import { parseEther } from "viem";

it("Should create a collection registry", async () => {
  const SHARD_ID = 1;
  const registryArtifacts = await artifacts.readArtifact("CollectionRegistry");

  const signer = new LocalECDSAKeySigner({ privateKey: config.privateKey });

  const wallet = await XWallet.init({
    address: config.walletAddress,
    rpc: config.rpc,
    signerOrPrivateKey: signer,
  });

  const registry = await XContract.deploy(
    wallet,
    registryArtifacts,
    [],
    SHARD_ID
  );

  let collectionsAmount = await registry.call({
    functionName: "getCollectionsAmountOf",
    args: [wallet.address],
  });
  expect(collectionsAmount).to.eq(0n);

  // Can create a collection
  await registry.sendMessage(
    { functionName: "createCollection", args: ["Collections", "COL"] },
    { feeCredit: parseEther("10000", "gwei") }
  );

  collectionsAmount = await registry.call({
    functionName: "getCollectionsAmountOf",
    args: [wallet.address],
  });

  expect(collectionsAmount).to.eq(1n);
});

it("Should create a collection", async () => {
  const SHARD_ID = 1;

  const client = new PublicClient({
    transport: new HttpTransport({
      endpoint: config.rpc,
    }),
    shardId: SHARD_ID,
  });

  const signer = new LocalECDSAKeySigner({ privateKey: config.privateKey });

  const account = new SmartAccountV1({
    client,
    signer,
    pubkey: signer.getPublicKey(),
    address: config.walletAddress,
  });

  const { address, hash } = await account.deployContract({
    shardId: SHARD_ID,
    bytecode: collectionBytecode as `0x${string}`,
    salt: BigInt(Date.now()),
    abi: collectionAbi as any,
    args: ["Col", "COL"],
  });

  const receipts = await waitTillCompleted(client, hash);

  receipts.forEach((r) => {
    expect(r.success).to.be.true;
  });
});
