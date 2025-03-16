import { it } from "mocha";
import { zeroAddress } from "viem";
import { initializeNil } from "./helpers/init";
import {
  createCollection,
  createNFT,
  deployCollectionRegistry,
  deployMarket,
} from "./helpers/deploy";

describe("Market::listNFT", () => {
  it("Should send NFT token to the Escrow, create an Order and increase virtual balance", async () => {
    const SHARD_ID = 2;
    const { wallet } = await initializeNil();

    const market = await deployMarket(wallet, SHARD_ID);
    const registry = await deployCollectionRegistry(wallet, SHARD_ID);

    const collection = await createCollection(
      registry,
      "Name",
      "SYM",
      "Contract URI:" + Date.now()
    );
    const nft = await createNFT(collection, wallet.address, 1n);

    const listTx = await market.sendTransaction(
      {
        functionName: "listNFT",
        args: [[{ nftId: nft.address, currencyId: zeroAddress, price: 10n }]],
      },
      {
        tokens: [{ id: nft.address, amount: 1n }],
        feeCredit: 10n ** 15n,
      }
    );
  });
});
