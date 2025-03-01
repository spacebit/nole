<<<<<<< Updated upstream
// import {
//   Hex,
//   HttpTransport,
//   LocalECDSAKeySigner,
//   PublicClient,
//   SmartAccountV1,
//   waitTillCompleted,
// } from "@nilfoundation/niljs";
// import config from "../utils/config";
=======
import {
  Hex,
  HttpTransport,
  LocalECDSAKeySigner,
  PublicClient,
  SmartAccountV1,
  waitTillCompleted,
} from "@nilfoundation/niljs";
import config from "../utils/config";
import artifacts from "../artifacts/contracts/Lock.sol/Lock.json";
>>>>>>> Stashed changes

// const deploy = async () => {
//   const client = new PublicClient({
//     transport: new HttpTransport({ endpoint: config.rpc }),
//   });
//   const signer = new LocalECDSAKeySigner({ privateKey: config.privateKey });
//   const account = new SmartAccountV1({
//     client,
//     signer,
//     pubkey: signer.getPublicKey(),
//     address: config.walletAddress,
//   });

//   const { hash } = await account.deployContract({
//     shardId: 1,
//     bytecode: artifacts.bytecode as Hex,    
//     salt: BigInt(Date.now()),
//     // abi: artifacts.abi,
//   });

//   const receipt = await waitTillCompleted(client, hash);
//   receipt.forEach((r) => console.log(r.gasUsed));
// };

// deploy().then(() => console.log("done"));
