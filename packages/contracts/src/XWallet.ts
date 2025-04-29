import {
  type BlockTag,
  type Hex,
  type ProcessedReceipt,
  type SendTransactionParams,
  getShardIdFromAddress,
  SmartAccountV1,
  Transaction,
  waitTillCompleted,
} from "@nilfoundation/niljs";
import { encodeFunctionData } from "viem";
import type { DeployParams, XWalletConfig } from "./types";
import { expectAllReceiptsSuccess } from "./utils";
import { XClient } from "./XClient";

export class XWallet {
  private constructor(
    readonly address: Hex,
    readonly client: XClient,
    readonly smartAccount: SmartAccountV1
  ) {}

  static async init(config: XWalletConfig) {
    const client = new XClient({
      shardId: getShardIdFromAddress(config.address),
      rpc: config.rpc,
      signerOrPrivateKey: config.signerOrPrivateKey,
    });

    const smartAccount = new SmartAccountV1({
      client: client.client,
      pubkey: client.signer!.getPublicKey(),
      signer: client.signer!,
      address: config.address,
    });

    return new XWallet(config.address, client, smartAccount);
  }

  async createCurrency(amount: bigint) {
    const createCurrencyCalldata = encodeFunctionData({
      abi: SmartAccountV1.abi,
      functionName: "mintToken",
      args: [amount],
    });

    const receipts = await this._callWaitResult(createCurrencyCalldata);
    const currencyId = this.address;

    return { receipts, currencyId };
  }

  async getCurrencies(blockTagOrHash: Hex | BlockTag = "latest") {
    return this.client.getCurrencies(this.address, blockTagOrHash);
  }

  async deployContract(params: DeployParams) {
    const { tx, address } = await this.smartAccount.deployContract({
      shardId: params.shardId,
      bytecode: params.bytecode,
      abi: params.abi,
      args: params.args,
      salt: params.salt,
    });

    const receipts = await this._waitResult(tx, true);

    return {
      receipts,
      address,
    };
  }

  async sendTransaction(messageParams: SendTransactionParams) {
    const tx = await this.smartAccount.sendTransaction(messageParams);

    return this._waitResult(tx, true);
  }

  private async _callWaitResult(
    calldata: Hex,
    feeCredit?: bigint,
    expectSuccess = true
  ): Promise<ProcessedReceipt[]> {
    const messageHash = await this._callExternal(calldata, feeCredit);

    return this._waitResult(messageHash, expectSuccess);
  }

  private async _waitResult(
    transaction: Hex,
    expectSuccess: boolean
  ): Promise<ProcessedReceipt[]>;
  private async _waitResult(
    transaction: Transaction,
    expectSuccess: boolean
  ): Promise<ProcessedReceipt[]>;
  private async _waitResult(
    transaction: Transaction | Hex,
    expectSuccess: boolean
  ) {
    const messageHash =
      transaction instanceof Transaction ? transaction.hash : transaction;
    const receipts = await waitTillCompleted(this.client.client, messageHash, {
      waitTillMainShard: true,
    });

    if (expectSuccess) expectAllReceiptsSuccess(receipts);
    return receipts;
  }

  private async _callExternal(calldata: Hex, feeCredit?: bigint) {
    return this.client.sendRawTransaction(this.address, calldata, feeCredit);
  }
}
