import {
  addHexPrefix,
  type BlockTag,
  CallArgs,
  externalTransactionEncode,
  type Hex,
  hexToBytes,
  HttpTransport,
  LocalECDSAKeySigner,
  PublicClient,
} from "@nilfoundation/niljs";
import type { IClient, XClientConfig } from "./types";
import { bytesToHex, encodeFunctionData, toHex } from "viem";

export class XClient implements IClient {
  client: PublicClient;
  transport: HttpTransport;
  shardId: number;
  rpc: string;
  signer?: LocalECDSAKeySigner;

  constructor(config: XClientConfig) {
    const { shardId, rpc, signerOrPrivateKey } = config;
    this.transport = new HttpTransport({ endpoint: rpc });
    this.client = new PublicClient({
      shardId: shardId,
      transport: this.transport,
    });

    this.shardId = shardId;
    this.rpc = rpc;
    if (signerOrPrivateKey) {
      typeof signerOrPrivateKey === "string"
        ? (this.signer = new LocalECDSAKeySigner({
            privateKey: signerOrPrivateKey,
          }))
        : (this.signer = signerOrPrivateKey);
    }
  }

  connect(config: Partial<XClientConfig>) {
    return new XClient({
      shardId: this.shardId,
      rpc: this.rpc,
      signerOrPrivateKey: this.signer,
      ...config,
    });
  }

  async estimateGas(callArgs: CallArgs, blockNumberOrHash: BlockTag) {
    let data: Hex;
    if (callArgs.abi) {
      data = encodeFunctionData({
        abi: callArgs.abi,
        functionName: callArgs.functionName,
        args: callArgs.args || [],
      });
    } else {
      data =
        typeof callArgs.data === "string" ? callArgs.data : addHexPrefix(bytesToHex(callArgs.data));
    }

    const sendData = {
      flags: callArgs.flags || [""],
      from: callArgs.from || undefined,
      to: callArgs.to,
      data: data,
      value: toHex(callArgs.value || 0n),
      feeCredit: (callArgs.feeCredit || 0).toString(10),
    };

    const params: unknown[] = [sendData, blockNumberOrHash];

    const resStr = await this.transport.request<{
      feeCredit: Hex;
      averagePriorityFee: Hex;
      maxBaseFee: Hex;
    }>({
      method: "eth_estimateFee",
      params,
    });

    const res = {
      feeCredit: BigInt(resStr.feeCredit),
      averagePriorityFee: BigInt(resStr.averagePriorityFee),
      maxBaseFee: BigInt(resStr.maxBaseFee),
    };

    return res;
  }

  async sendRawTransaction(
    address: Hex,
    calldata: Hex,
    // TODO remove undefined (?)
    feeCredit?: bigint
  ): Promise<Hex> {
    if (!this.signer) throw Error("The client has no signer");

    const { seqno, chainId } = await this.getCallParams(address);

    const { raw } = await externalTransactionEncode(
      {
        seqno,
        chainId,
        isDeploy: false,
        feeCredit,
        to: hexToBytes(address),
        data: hexToBytes(calldata),
      },
      this.signer
    );

    return this.client.sendRawTransaction(raw);
  }

  async call(
    ...args: Parameters<PublicClient["call"]>
  ): Promise<ReturnType<PublicClient["call"]>> {
    return this.client.call(...args);
  }

  async getCurrencies(address: Hex, blockTagOrHash: Hex | BlockTag = "latest") {
    return this.client.getTokens(address, blockTagOrHash);
  }

  async getCallParams(address: Hex) {
    const [seqno, chainId] = await Promise.all([
      this.client.getTransactionCount(address, "latest"),
      this.client.chainId(),
    ]);

    return { seqno, chainId };
  }
}
