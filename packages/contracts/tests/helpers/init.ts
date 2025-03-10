import { LocalECDSAKeySigner } from "@nilfoundation/niljs";
import { XWallet } from "../../src/XWallet";
import config from "../../utils/config";

export const initializeNil = async () => {
  const signer = new LocalECDSAKeySigner({ privateKey: config.privateKey });

  const wallet = await XWallet.init({
    address: config.walletAddress,
    rpc: config.rpc,
    signerOrPrivateKey: signer,
  });

  return { signer, wallet };
};
