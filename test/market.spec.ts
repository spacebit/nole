import { artifacts } from "hardhat";
import {
  Faucet,
  Hex,
  HttpTransport,
  PublicClient,
  toHex,
} from "@nilfoundation/niljs";
import { expect } from "chai";
import { XWallet, XContract } from "@spacebit/simple-nil";
import config from "../config";
import { Market$Type } from "../artifacts/contracts/Market.sol/Market";

describe("Marketplace", () => {
  const SHARD_ID = 1;

  let seller: XWallet;
  let buyer: XWallet;
  let market: XContract<Market$Type["abi"]>;
  let buyerCurrency: Hex;
  let faucet: Faucet;

  before(async () => {
    const marketArtifacts = await artifacts.readArtifact("Market");
    const client = new PublicClient({
      transport: new HttpTransport({ endpoint: config.rpc }),
    });
    faucet = new Faucet(client);
    await faucet.withdrawToWithRetry(config.walletAddress, 10n ** 16n);
    seller = await XWallet.deploy({
      ...config,
      signerOrPrivateKey: config.signerPrivateKey,
    });
    buyer = await XWallet.deploy({
      ...config,
      signerOrPrivateKey: config.signerPrivateKey,
    });
    market = await XContract.deploy(seller, marketArtifacts, [], SHARD_ID);

    buyerCurrency = (await buyer.createCurrency(1000n)).currencyId;
  });

  it("e2e scenario", async () => {
    const collectionArtifacts = await artifacts.readArtifact("XCollection");
    const NFT_ID = 5n;
    const PRICE = 100n;

    const nftCollection = await XContract.deploy(
      seller,
      collectionArtifacts,
      ["Collection Name", "SYMBOL"],
      1,
    );

    const result = await nftCollection.sendMessage(
      {
        functionName: "mint",
        args: [seller.address, NFT_ID],
      },
      { feeCredit: 10_000_000n },
    );

    const nftId = await nftCollection.call({
      functionName: "getTokenAddress",
      args: [NFT_ID],
    });

    const approved = await seller.approve(market.address, [
      {
        id: nftId,
        amount: 1n,
      },
    ]);

    const put = await market.connect(seller).sendMessage(
      {
        functionName: "put",
        args: [nftId, buyerCurrency, PRICE],
      },
      { feeCredit: 3_000_000n },
    );

    const order = await market.call({
      functionName: "getOrder",
      args: [nftId],
    });

    const buy = await market.connect(buyer).sendMessage(
      {
        functionName: "buy",
        args: [nftId],
      },
      {
        feeCredit: 300_000_000n,
        tokens: [{ id: buyerCurrency, amount: PRICE }],
      },
      false,
    );

    //////// ASSERT ////////

    const sellerNftBalance = await market.call({
      functionName: "getBalance",
      args: [seller.address, nftId],
    });

    const sellerFungibleBalance = await market.call({
      functionName: "getBalance",
      args: [seller.address, buyerCurrency],
    });

    const buyerNftBalance = await market.call({
      functionName: "getBalance",
      args: [buyer.address, nftId],
    });

    const buyerFungibleBalance = await market.call({
      functionName: "getBalance",
      args: [buyer.address, buyerCurrency],
    });

    // Tokens are sent to recipients
    // All virtual balances eq 0
    expect(sellerNftBalance).to.eq(0n);
    expect(buyerNftBalance).to.eq(0n);
    expect(sellerFungibleBalance).to.eq(0n);
    expect(buyerFungibleBalance).to.eq(0n);

    const sellerCurrencies = await seller.getCurrencies();
    const buyerCurrencies = await buyer.getCurrencies();

    // TODO expect currencies
  });

  it("user can deposit and withdraw tokens", async () => {
    const DEPOSIT = 100n;

    let currencies = await buyer.getCurrencies();
    const balanceBefore = currencies[buyerCurrency];
    const deposit = await market.connect(buyer).sendMessage(
      {
        functionName: "deposit",
        args: [],
      },
      {
        tokens: [{ id: buyerCurrency, amount: DEPOSIT }],
        feeCredit: 300_000n,
      },
    );

    // Wallet's balance decreased
    currencies = await buyer.getCurrencies();
    const ccc = await buyer.client.getCurrencies(buyer.address);
    const balanceAfterDeposit = currencies[buyerCurrency];
    expect(balanceAfterDeposit).to.eq(balanceBefore - DEPOSIT);

    // Virtual balance increased
    let virtualBalance = await market.call({
      functionName: "getBalance",
      args: [buyer.address, buyerCurrency],
    });
    expect(virtualBalance).eq(DEPOSIT);

    const withdrawResult = await market.connect(buyer).sendMessage(
      {
        functionName: "withdraw",
        args: [{ id: buyerCurrency, amount: 100n }],
      },
      {
        feeCredit: 1_000_000n,
      },
    );

    // Wallet's balance increased
    currencies = await buyer.getCurrencies();
    const balanceAfterWithdraw = currencies[buyerCurrency];
    expect(balanceAfterWithdraw).eq(balanceBefore);

    // Virtual balance decreased
    virtualBalance = await market.call({
      functionName: "getBalance",
      args: [buyer.address, buyerCurrency],
    });
    expect(virtualBalance).eq(0n);
  });

  it("if withdraw reverts market will top up wallet's virtual balance", async () => {
    // Arrange
    const DEPOSIT = 50n;
    const revertWalletArtifacts = await artifacts.readArtifact(
      "contracts/test/WalletRevert.sol:XWalletRevert",
    );
    const buyerPubkey = toHex(await buyer.client.signer!.getPublicKey());
    const revertWalletContract = await XContract.deploy(
      buyer,
      {
        abi: revertWalletArtifacts.abi,
        bytecode: revertWalletArtifacts.bytecode,
      },
      [buyerPubkey, market.address],
      SHARD_ID,
    );
    const topupRevertWallet = await buyer.sendMessage({
      to: revertWalletContract.address,
      feeCredit: 300_000n,
      value: 10n ** 14n,
      tokens: [{ id: buyerCurrency, amount: 100n }],
    });

    const revertWallet = await XWallet.init({
      address: revertWalletContract.address,
      rpc: config.rpc,
      signerOrPrivateKey: config.signerPrivateKey,
    });

    // Act
    let currencies = await revertWallet.getCurrencies();
    const balanceBefore = currencies[buyerCurrency];
    const deposit = await market.connect(revertWallet).sendMessage(
      {
        functionName: "deposit",
        args: [],
      },
      {
        tokens: [{ id: buyerCurrency, amount: DEPOSIT }],
        feeCredit: 300_000n,
      },
    );

    // Virtual balance increased
    let virtualBalance = await market.call({
      functionName: "getBalance",
      args: [revertWallet.address, buyerCurrency],
    });
    expect(virtualBalance).eq(DEPOSIT);

    currencies = await revertWallet.getCurrencies();
    const balanceAfterDeposit = currencies[buyerCurrency];
    expect(balanceAfterDeposit).to.eq(balanceBefore - DEPOSIT);

    const withdrawResult = await market.connect(revertWallet).sendMessage(
      {
        functionName: "withdraw",
        args: [{ id: buyerCurrency, amount: DEPOSIT }],
      },
      {
        feeCredit: 1_000_000n,
      },
      false,
    );

    //Assert

    currencies = await revertWallet.getCurrencies();
    const balanceAfterWithdraw = currencies[buyerCurrency];
    // Wallet's didn't receive withdrawn tokens
    expect(balanceAfterWithdraw).eq(balanceAfterDeposit);

    // Virtual balance didn't change
    virtualBalance = await market.call({
      functionName: "getBalance",
      args: [revertWallet.address, buyerCurrency],
    });
    expect(virtualBalance).eq(DEPOSIT);
  });
});
