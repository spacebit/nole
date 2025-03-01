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
  abi,
  bytecode,
} from "../artifacts/contracts/Collection.sol/Collection.json";

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
    bytecode: bytecode as `0x${string}`,
    salt: BigInt(Date.now()),
    // feeCredit: 100_000_000_000_000n,
    abi: abi as any,
    args: ["Col", "COL"],
  });

  const receipts = await waitTillCompleted(client, hash);

  receipts.forEach((r) => {
    expect(r.success).to.be.true;
  });
});
