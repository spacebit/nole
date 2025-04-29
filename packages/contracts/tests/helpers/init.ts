import { LocalECDSAKeySigner } from "@nilfoundation/niljs";
import { XWallet } from "../../src/XWallet";
import config from "../../utils/config";

export const initializeNil = async (address = config.wallets[0]) => {
  const signer = new LocalECDSAKeySigner({ privateKey: config.privateKey });

  const wallet = await XWallet.init({
    address,
    rpc: config.rpc,
    signerOrPrivateKey: signer,
  });

  return wallet;
};
