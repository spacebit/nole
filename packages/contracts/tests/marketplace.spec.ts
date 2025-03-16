import { it } from "mocha";
import { zeroAddress } from "viem";
import { initializeNil } from "./helpers/init";
import {
  createCollection,
  createNFT,
  deployCollectionRegistry,
  deployMarket,
} from "./helpers/deploy";
import { expect } from "chai";

describe("Market::listNFT", () => {
  it("Should send NFT token to the Escrow, create an Order and increase virtual balance", async () => {
    const SHARD_ID = 2;
    const PRICE = 144n;
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

    // ACT

    const listTx = await market.sendTransaction(
      {
        functionName: "listNFT",
        args: [[{ nftId: nft.address, currencyId: zeroAddress, price: PRICE }]],
      },
      {
        tokens: [{ id: nft.address, amount: 1n }],
        feeCredit: 10n ** 15n,
      }
    );

    // ASSERT
    const order = await market.call({
      functionName: "getOrder",
      args: [nft.address],
    });

    // Expect order created
    expect(order?.currencyId).eq(zeroAddress);
    expect(order?.nftId.toLowerCase()).eq(nft.address);
    expect(order?.price).eq(PRICE);

    // Expect NFT transferred to the escrow
    const marketCurrencies = await wallet.client.getCurrencies(market.address);
    expect(marketCurrencies).has.property(nft.address).eq(1n);
  });
});
