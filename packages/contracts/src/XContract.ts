import { toHex, type Hex } from "@nilfoundation/niljs";
import {
  type Abi,
  type ContractConstructorArgs,
  type ContractFunctionName,
  decodeFunctionResult,
  type DecodeFunctionResultReturnType,
  encodeFunctionData,
  type EncodeFunctionDataParameters,
} from "viem";
import type { MessageTokens } from "./types";
import { expectAllReceiptsSuccess } from "./utils/receipt";
import { XWallet } from "./XWallet";

export class XContract<T extends Abi> {
  constructor(private abi: T, readonly wallet: XWallet, public address: Hex) {}

  static connect<T extends Abi>(
    wallet: XWallet,
    abi: T,
    address: Hex
  ): XContract<T> {
    return new XContract(abi, wallet, address);
  }

  static async deploy<T extends Abi>(
    wallet: XWallet,
    artifact: { abi: T; bytecode: Hex },
    args: ContractConstructorArgs<T>,
    shardId: number,
    salt?: bigint
  ): Promise<XContract<T>> {
    const { address, receipts } = await wallet.deployContract({
      abi: artifact.abi,
      args: args as unknown[],
      bytecode: artifact.bytecode,
      feeCredit: 10_000_000n,
      shardId,
      salt: salt ?? BigInt(Date.now()),
    });

    expectAllReceiptsSuccess(receipts);

    return new XContract(artifact.abi, wallet, address);
  }

  connect(wallet: XWallet) {
    return new XContract(this.abi, wallet, this.address);
  }

  async sendTransaction<functionName extends ContractFunctionName<T>>(
    params: Omit<EncodeFunctionDataParameters<T, functionName>, "abi">,
    messageTokens?: MessageTokens,
    expectSuccess = true
  ) {
    const encodedData = encodeFunctionData({
      abi: this.abi as any,
      functionName: params.functionName,
      args: params.args as any,
    });
  
    let feeCredit = messageTokens?.feeCredit;

    // if (!messageTokens?.feeCredit) {
    //   const gasEstimation = await this.wallet.client.estimateGas({
    //     to: this.address,
    //     from: this.wallet.address,
    //     data: encodedData,
    //     value: messageTokens?.value ?? 0n,
    //     feeCredit: 0n,
    //   }, 'latest')

    //   feeCredit = gasEstimation.feeCredit;
    // }

    const receipts = await this.wallet.sendTransaction({
      to: this.address,
      data: encodeFunctionData({
        abi: this.abi as any,
        functionName: params.functionName,
        args: params.args as any,
      }),
      feeCredit,
      value: messageTokens?.value,
      tokens: messageTokens?.tokens,
      
    });

    if (expectSuccess) expectAllReceiptsSuccess(receipts);

    return receipts;
  }

  async call<functionName extends ContractFunctionName<T>>(
    params: Omit<EncodeFunctionDataParameters<T, functionName>, "abi">
  ) {
    try {
      const encodedData = encodeFunctionData({
        abi: this.abi as any,
        functionName: params.functionName,
        args: params.args as any,
      });
      const result = await this.wallet.client.call(
        {
          to: this.address,
          data: encodedData,
        },
        "latest"
      );

      return decodeFunctionResult({
        abi: this.abi as any,
        functionName: params.functionName as any,
        data: result.data,
      }) as DecodeFunctionResultReturnType<T, functionName>;
    } catch (error) {
      console.log(error);
    }
  }
}
