const getConfig = () => {
  const {NEXT_PUBLIC_RPC} = process.env;

  if (!NEXT_PUBLIC_RPC) throw Error("nil RPC endpoint does not set. Did you forget to set .env?");

  return {
    rpc: NEXT_PUBLIC_RPC
  }
}

export const config = getConfig();
