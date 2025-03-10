import { expect } from "chai";
import { it } from "mocha";
import { artifacts } from "hardhat";
import { LocalECDSAKeySigner } from "@nilfoundation/niljs";
import config from "../utils/config";
import { XWallet } from "../src/XWallet";
import { XContract } from "../src/XContract";
import { parseEther } from "viem";
import { initializeNil } from "./helpers/init";
import { deployCollection, deployCollectionRegistry, deployMarket } from "./helpers/deploy";


describe("Market::listNFT", () => {
  it("Should send NFT token to the Escrow, create an Order and increase virtual balance", async () => {
    const SHARD_ID = 2;
    const {wallet} = await initializeNil();

    const market = await deployMarket(wallet, SHARD_ID);
    const registry = await deployCollectionRegistry(wallet, SHARD_ID);

    await deployCollection(registry, "", "", "")
  });
});

