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
import { XContract } from "../src/XContract";
import {
  CollectionXContract,
  MarketXContract,
  NFTXContract,
} from "../utils/artifacts";
import config from "../utils/config";
import { XWallet } from "../src/XWallet";
import { expectTokenBelongsTo } from "./helpers/expect";

describe("Market", () => {
  const SHARD_ID = 2;
  const PRICE = 144n;

  let seller: XWallet;
  let buyer: XWallet;
  let market: MarketXContract;
  let collection: CollectionXContract;
  let nft: NFTXContract;

  it("Should send NFT token to the Escrow, create an Order and increase virtual balance", async () => {
    seller = await initializeNil(config.wallets[0]);
    buyer = await initializeNil(config.wallets[1]);

    console.log(await seller.client.client.getBalance(seller.address));
    console.log(await seller.client.client.getBalance(buyer.address));

    market = await deployMarket(seller, SHARD_ID);
    const registry = await deployCollectionRegistry(seller, SHARD_ID);

    collection = await createCollection(
      registry,
      "Name",
      "SYM",
      "Contract URI:" + Date.now()
    );
    nft = await createNFT(collection, seller.address, 1n);

    // ACT

    const listTx = await market.sendTransaction(
      {
        functionName: "list",
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
    await expectTokenBelongsTo({ nft: nft.address, owner: market.address });
  });

  it("Should buy NFT by sending correct amount of tokens", async () => {
    const buyTx = await market.connect(buyer).sendTransaction(
      {
        functionName: "buy",
        args: [nft.address],
      },
      {
        feeCredit: 10n ** 15n,
        value: PRICE,
      }
    );

    // TODO:
    // await expectTokenBelongsTo({ nft: nft.address, owner: buyer.address });
  });
});
