import { expect } from "chai";
import { it } from "mocha";
import { artifacts } from "hardhat";
import { LocalECDSAKeySigner } from "@nilfoundation/niljs";
import config from "../utils/config";
import { XWallet } from "../src/XWallet";
import { XContract } from "../src/XContract";
import { parseEther } from "viem";
import { initializeNil } from "./helpers/init";

it("Should create a collection registry", async () => {
  const SHARD_ID = 1;
  const registryArtifacts = await artifacts.readArtifact("CollectionRegistry");

  const {wallet} = await initializeNil();

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
  await registry.sendTransaction(
    {
      functionName: "createCollection",
      args: ["Collections", "COL", "http://xxx"],
    },
    { feeCredit: parseEther("10000", "gwei") }
  );

  await registry.sendTransaction(
    {
      functionName: "createCollection",
      args: ["Collections", "COL", "http://yyy"],
    },
    { feeCredit: parseEther("10000", "gwei") }
  );

  collectionsAmount = await registry.call({
    functionName: "getCollectionsAmountOf",
    args: [wallet.address],
  });

  expect(collectionsAmount).to.eq(2n);

  const collections = await registry.call({
    functionName: "getCollectionsOf",
    args: [wallet.address],
  });
});
