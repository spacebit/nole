import {
  type BlockTag,
  externalTransactionEncode,
  type Hex,
  hexToBytes,
  HttpTransport,
  LocalECDSAKeySigner,
  PublicClient,
} from "@nilfoundation/niljs";
import type { IClient, XClientConfig } from "./types";

export class XClient implements IClient {
  client: PublicClient;
  shardId: number;
  rpc: string;
  signer?: LocalECDSAKeySigner;

  constructor(config: XClientConfig) {
    const { shardId, rpc, signerOrPrivateKey } = config;
    this.client = new PublicClient({
      shardId: shardId,
      transport: new HttpTransport({ endpoint: rpc }),
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

  async sendRawMessage(
    address: Hex,
    calldata: Hex,
    isDeploy: boolean
  ): Promise<Hex> {
    if (!this.signer) throw Error("The client has no signer");

    const { seqno, chainId } = await this.getCallParams(address);

    const { raw } = await externalTransactionEncode(
      {
        seqno,
        chainId,
        isDeploy,
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
