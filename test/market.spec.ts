import { artifacts } from "hardhat";
import { deployRandomXWallet } from "../src/scripts/deploy-xwallet";
import { hexToBigInt } from "@nilfoundation/niljs";
import { expect } from "chai";
import { XContract } from "../src/client/XContract";

it("Marketplace e2e scenario", async () => {
  const marketArtifacts = await artifacts.readArtifact("Market");
  const collectionArtifacts = await artifacts.readArtifact("XCollection");
  const SHARD_ID = 1;
  const NFT_ID = 5n;
  const PRICE = 100n;

  const seller = await deployRandomXWallet();
  const buyer = await deployRandomXWallet();

  const nftCollection = await XContract.deploy(
    seller,
    collectionArtifacts,
    ["Collection Name", "SYMBOL"],
    1,
  );

  await nftCollection.sendMessage(
    {
      functionName: "mint",
      args: [seller.address, NFT_ID],
    },
    10_000_000n,
  );

  const nftId = await nftCollection
    .call({
      functionName: "getTokenAddress",
      args: [NFT_ID],
    })
    .then(hexToBigInt);

  const buyerCurrency = await buyer.createCurrency(1000n);

  const market = await XContract.deploy(seller, marketArtifacts, [], SHARD_ID);

  await seller.approve(market.address, [
    {
      id: nftId,
      amount: 1n,
    },
  ]);

  await market.sendMessage(
    {
      functionName: "put",
      args: [nftId, buyerCurrency.currencyId, PRICE],
    },
    3_000_000n,
  );

  await buyer.approve(market.address, [
    { id: buyerCurrency.currencyId, amount: PRICE },
  ]);

  await market.connect(buyer).sendMessage(
    {
      functionName: "buy",
      args: [nftId],
    },
    300_000_000n,
  );

  //////// ASSERT ////////

  const sellerNftBalance = await market.call({
    functionName: "getBalance",
    args: [seller.address, nftId],
  });

  const sellerFungibleBalance = await market.call({
    functionName: "getBalance",
    args: [seller.address, buyerCurrency.currencyId],
  });

  const buyerNftBalance = await market.call({
    functionName: "getBalance",
    args: [buyer.address, nftId],
  });

  const buyerFungibleBalance = await market.call({
    functionName: "getBalance",
    args: [buyer.address, buyerCurrency.currencyId],
  });

  expect(sellerNftBalance).to.eq(0n);
  expect(buyerNftBalance).to.eq(1n);

  expect(sellerFungibleBalance).to.eq(PRICE);
  expect(buyerFungibleBalance).to.eq(0n);
});
