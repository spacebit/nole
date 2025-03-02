import {
  type Hex,
  LocalECDSAKeySigner,
  PublicClient,
  type SendTransactionParams,
} from '@nilfoundation/niljs';
import type { Abi } from 'viem';

export interface IClient {
  call: (
    ...args: Parameters<PublicClient['call']>
  ) => Promise<ReturnType<PublicClient['call']>>;
  client: PublicClient;
}

export interface IWallet {
  deployContract: (params: DeployParams) => any;
  sendMessage: (params: SendTransactionParams) => any;
  client: IClient;
}

interface MinimalClientConfig {
  rpc: string;
  signerOrPrivateKey?: LocalECDSAKeySigner | Hex;
}

export interface XClientConfig extends MinimalClientConfig {
  shardId: number;
}

/**
 * Options for initializing the XWallet.
 */
export interface XWalletConfig extends Required<MinimalClientConfig> {
  address: Hex;
}

/**
 * Represents a currency with an ID and amount.
 */
export type Currency = {
  id: Hex;
  amount: bigint;
};

/**
 * Represents message tokens including fee credit, value, and optional tokens.
 */
export type MessageTokens = {
  feeCredit: bigint;
  value?: bigint;
  tokens?: Currency[];
};

/**
 * Parameters required for deployment.
 */
export type DeployParams = {
  bytecode: Uint8Array | Hex;
  abi: Abi;
  args: unknown[];
  salt: Uint8Array | bigint;
  shardId: number;
  feeCredit: bigint;
  value?: bigint;
};