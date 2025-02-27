import { isHexString } from '@nilfoundation/niljs';
import * as dotenv from 'dotenv';
dotenv.config();

const getConfig = () => {
  const { SMART_ACCOUNT, PRIVATE_KEY, RPC } = process.env;

  if (!SMART_ACCOUNT || !PRIVATE_KEY || !RPC)
    throw Error("Did you forget to set .env?");

  if (!isHexString(SMART_ACCOUNT) || !isHexString(PRIVATE_KEY)) 
    throw Error("SMART_ACCOUNT and PRIVATE_KEY envs should start with 0x")

  return {
    walletAddress: SMART_ACCOUNT,
    privateKey: PRIVATE_KEY,
    rpc: RPC,
  };
};

export default getConfig();
