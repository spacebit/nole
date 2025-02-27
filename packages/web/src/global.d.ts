/* eslint-disable @typescript-eslint/no-explicit-any */
export {};

declare global {
  interface Window {
    nil?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}
