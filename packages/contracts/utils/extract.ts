import { Hex } from "@nilfoundation/niljs";

export const extractAddressFromLogs = (log: string): Hex => {
  return `0x${log.slice(-40)}` as Hex;
};
