import { task } from "hardhat/config";
import { HttpTransport, LocalECDSAKeySigner, PublicClient, SmartAccountV1 } from "@nilfoundation/niljs";
import config from "../utils/config";

task("deploy").setAction(async (taskArgs, _) => {
  const client = new PublicClient({transport: new HttpTransport({endpoint: config.rpc})});
  const signer = new LocalECDSAKeySigner({ privateKey: config.privateKey });
  const account = new SmartAccountV1({
    client,
    signer,
    pubkey: signer.getPublicKey(),
    address: config.walletAddress,
  });
});
