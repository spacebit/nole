import {
  type BlockTag,
  type Hex,
  type ProcessedReceipt,
  type SendTransactionParams,
  bytesToHex,
  getShardIdFromAddress,
  refineAddress,
  SmartAccountV1,
  waitTillCompleted,
} from "@nilfoundation/niljs";
import { encodeFunctionData } from "viem";
import type { DeployParams, XWalletConfig } from "./types";
import { expectAllReceiptsSuccess } from "./utils";
import { XClient } from "./XClient";

export class XWallet {
  private constructor(readonly address: Hex, readonly client: XClient, readonly smartAccount: SmartAccountV1) {}

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
    })

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
    const {hash, address} = await this.smartAccount.deployContract({
      shardId: params.shardId,
      bytecode: params.bytecode,
      abi: params.abi,
      args: params.args,
      salt: params.salt,
    });

    const receipts = await this._waitResult(hash, true);

    return {
      receipts,
      address,
    };
  }

  async sendMessage(messageParams: SendTransactionParams) {
    const hexTo = refineAddress(messageParams.to);
    const hexRefundTo = refineAddress(messageParams.refundTo ?? this.address);
    const hexBounceTo = refineAddress(messageParams.bounceTo ?? this.address);
    const hexData = messageParams.data
      ? messageParams.data instanceof Uint8Array
        ? bytesToHex(messageParams.data)
        : messageParams.data
      : "0x";

    const callData = encodeFunctionData({
      abi: SmartAccountV1.abi,
      functionName: "asyncCall",
      args: [
        hexTo,
        hexRefundTo,
        hexBounceTo,
        messageParams.tokens ?? [],
        messageParams.value ?? 0n,
        hexData,
      ],
    });

    return this._callWaitResult(callData);
  }

  private async _callWaitResult(
    calldata: Hex,
    isDeploy = false,
    expectSuccess = true
  ): Promise<ProcessedReceipt[]> {
    const messageHash = await this._callExternal(calldata, isDeploy);

    return this._waitResult(messageHash, expectSuccess);
  }

  private async _waitResult(messageHash: Hex, expectSuccess = true) {
    const receipts = await waitTillCompleted(this.client.client, messageHash);
    if (expectSuccess) expectAllReceiptsSuccess(receipts);
    return receipts;
  }

  private async _callExternal(calldata: Hex, isDeploy = false) {
    return this.client.sendRawMessage(this.address, calldata, isDeploy);
  }
}
