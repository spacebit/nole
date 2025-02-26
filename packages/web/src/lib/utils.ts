/**
 * Shortens an Ethereum address.
 *
 * @param address - The full Ethereum address (e.g., "0x1234567890abcdef1234567890abcdef12345678")
 * @returns A shortened version (e.g., "0x123...678")
 */
export function shortenAddress(address: string): string {
  if (!address || address.length < 8) return address;
  return `${address.slice(0, 5)}...${address.slice(-3)}`;
}