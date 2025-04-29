import { Hex, isHexString } from '@nilfoundation/niljs';
import * as dotenv from 'dotenv';
dotenv.config();

const getConfig = () => {
  const { SMART_ACCOUNT, PRIVATE_KEY, RPC } = process.env;

  if (!SMART_ACCOUNT || !PRIVATE_KEY || !RPC)
    throw Error("Did you forget to set .env?");

  const accounts = SMART_ACCOUNT.split(',');
  accounts.forEach(a => {
    if (!isHexString(a)) throw Error("SMART_ACCOUNT should start with 0x")
  })

  if (!isHexString(PRIVATE_KEY)) 
    throw Error("PRIVATE_KEY env should start with 0x")

  return {
    wallets: accounts as Hex[],
    privateKey: PRIVATE_KEY,
    rpc: RPC,
  };
};

export default getConfig();
