import { expect } from "chai";
import { it } from "mocha";
import { artifacts } from "hardhat";
import { XContract } from "../src/XContract";
import { parseEther } from "viem";
import { initializeNil } from "./helpers/init";

it("Should create a collection registry", async () => {
  const SHARD_ID = 1;
  const registryArtifacts = await artifacts.readArtifact("CollectionRegistry");

  const wallet = await initializeNil();

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
  const createCollectionReceipts1 = await registry.sendTransaction(
    {
      functionName: "createCollection",
      args: ["Collections", "COL", "http://xxx"],
    },
    { feeCredit: parseEther("100000", "gwei") }
  );

  console.log(createCollectionReceipts1.reduce((prev, curr) => prev + curr.gasUsed, 0n))

  const createCollectionReceipts2 = await registry.sendTransaction(
    {
      functionName: "createCollection",
      args: ["Collections", "COL", "http://yyy"],
    },
    { feeCredit: parseEther("100000", "gwei") }
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
