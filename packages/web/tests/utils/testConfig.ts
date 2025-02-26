const getConfig = () => {
  const { NEXT_PUBLIC_RPC, SMART_ACCOUNT, PRIVATE_KEY } = process.env;

  if (!NEXT_PUBLIC_RPC || !SMART_ACCOUNT || !PRIVATE_KEY)
    throw Error("nil RPC endpoint does not set. Did you forget to set .env?");

  return {
    rpc: NEXT_PUBLIC_RPC,
    wallet: SMART_ACCOUNT,
    privateKey: PRIVATE_KEY,
  };
};

export default getConfig();
