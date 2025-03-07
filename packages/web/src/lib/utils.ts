/**
 * Shortens an Ethereum address.
 *
 * @param address - The full Ethereum address (e.g., "0x0001234567890abcdef1234567abcdef12345678")
 * @returns A shortened version (e.g., "0x00012...678")
 */
export function shortenAddress(address: string): string {
  if (!address || address.length < 8) return address;
  return `${address.slice(0, 7)}...${address.slice(-3)}`;
}

export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
