import { expect } from "chai";
import { it } from "mocha";
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
import {
  abi as registryAbi,
  bytecode as registryBytecode,
} from "../artifacts/contracts/CollectionRegistry.sol/CollectionRegistry.json"

it("Should create a collection registry", async () => {
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
    bytecode: registryBytecode as `0x${string}`,
    salt: BigInt(Date.now()),
  });

  const receipts = await waitTillCompleted(client, hash);

  receipts.forEach((r) => {
    expect(r.success).to.be.true;
  });

  console.log(address);
})

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
    // feeCredit: 100_000_000_000_000n,
    abi: collectionAbi as any,
    args: ["Col", "COL"],
  });

  const receipts = await waitTillCompleted(client, hash);

  receipts.forEach((r) => {
    expect(r.success).to.be.true;
  });
});
